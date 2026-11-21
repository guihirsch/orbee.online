#!/usr/bin/env python3
"""Gate de consumer do pstack: valida artefatos e prova de um PR.

Roda no repo-alvo, sem depender do pstack instalado. Lê
`.pstack/harness.json`, calcula o diff contra a base e exige os artefatos
declarados (statechart/formal, blast radius, prova e review.json).

Vendorizado de guihirsch/operacao-agentes, pstack-core/scripts/check-consumer.py,
commit 95e81be96288fd278652b15e4c6ec0594e436257 (main). Mantenha este arquivo
igual à origem; atualize o commit acima ao re-vendorizar.
"""

from __future__ import annotations

import argparse
import fnmatch
import json
import os
import re
import signal
import subprocess
import sys
from pathlib import Path
from typing import Any

DEFAULT_CONFIG_CANDIDATES = (
    "pstack.json",
    ".pstack/harness.json",
    "docs/pstack/harness.json",
)
SEVERITIES_BLOCKING = {"BLOCKER", "MAJOR"}


class GateError(Exception):
    def __init__(self, message: str, *, status: int = 1):
        super().__init__(message)
        self.status = status


def run(cmd: list[str], cwd: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        cmd,
        cwd=cwd,
        text=True,
        capture_output=True,
        encoding="utf-8",
        errors="surrogateescape",
    )


def git_names(root: Path, diff_spec: str) -> list[str]:
    result = run(
        ["git", "diff", "-z", "--no-renames", "--name-only", diff_spec], root
    )
    if result.returncode != 0:
        raise GateError(
            f"não foi possível diffar {diff_spec!r}: {result.stderr.strip()}",
            status=2,
        )
    return [part for part in result.stdout.split("\0") if part]


def git_head(root: Path) -> str:
    result = run(["git", "rev-parse", "HEAD"], root)
    if result.returncode != 0:
        raise GateError("não é um repositório git ou HEAD ausente", status=2)
    return result.stdout.strip()


def changed_files(root: Path, base: str) -> list[str]:
    return git_names(root, f"{base}...HEAD")


def matches(path: str, patterns: list[str]) -> bool:
    for pattern in patterns:
        candidates = [pattern]
        if pattern.startswith("**/"):
            candidates.append(pattern[3:])
        if pattern.endswith("/**"):
            candidates.append(pattern[:-3])
        if any(fnmatch.fnmatch(path, candidate) for candidate in candidates):
            return True
    return False


def nonempty(path: Path, min_bytes: int = 1) -> bool:
    return (
        path.is_file()
        and not path.is_symlink()
        and path.stat().st_size >= max(1, min_bytes)
    )


def content_ok(path: Path, min_bytes: int = 1) -> bool:
    if not nonempty(path, min_bytes):
        return False
    try:
        text = path.read_text(encoding="utf-8", errors="surrogateescape")
    except OSError:
        return False
    placeholders = ("<slug>", "<comando>", "<saída", "<lentes>", "preencher")
    return not any(token in text.lower() for token in placeholders)


def has_statechart(directory: Path, min_bytes: int) -> bool:
    chart = directory / "statechart"
    if chart.is_symlink() or (chart / "out").is_symlink():
        return False
    spec = chart / "SPEC.tla"
    report = chart / "out" / "report.md"
    alt_report = chart / "report.md"
    return nonempty(spec, min_bytes) and (
        nonempty(report, min_bytes) or nonempty(alt_report, min_bytes)
    )


def has_formal(directory: Path, min_bytes: int) -> bool:
    formal = directory / "formal"
    if formal.is_symlink() or (formal / "out").is_symlink():
        return False
    spec = formal / "SPEC.tla"
    report = formal / "out" / "report.md"
    alt_report = formal / "report.md"
    return nonempty(spec, min_bytes) and (
        nonempty(report, min_bytes) or nonempty(alt_report, min_bytes)
    )


def proof_ok(directory: Path, min_bytes: int) -> bool:
    for name in ("06-prova.md", "06-prova.txt"):
        if content_ok(directory / name, min_bytes):
            return True
    proof_dir = directory / "06-prova"
    if proof_dir.is_symlink() or not proof_dir.is_dir():
        return False
    return any(
        path.is_file()
        and not path.is_symlink()
        and content_ok(path, min_bytes)
        for path in proof_dir.rglob("*")
    )


def decisions_ok(directory: Path, min_bytes: int) -> bool:
    path = directory / "decisions.tsv"
    if not content_ok(path, min_bytes):
        return False
    try:
        text = path.read_text(
            encoding="utf-8-sig", errors="surrogateescape"
        )
    except OSError:
        return False
    lines = [line for line in text.splitlines() if line.strip()]
    if len(lines) < 2:
        return False
    header = [item.strip() for item in lines[0].split("\t")]
    if header != ["timestamp", "decision", "evidence", "owner"]:
        return False
    for line in lines[1:]:
        fields = [item.strip() for item in line.split("\t")]
        if len(fields) != 4 or not all(fields):
            return False
    return True


def artifact_ok(directory: Path, requirement: str, min_bytes: int) -> bool:
    if requirement == "spec":
        return content_ok(directory / "02-spec.md", min_bytes)
    if requirement == "statechart":
        return has_statechart(directory, min_bytes)
    if requirement == "formal":
        return has_formal(directory, min_bytes)
    if requirement == "blast_radius":
        return content_ok(directory / "05-blast-radius.md", min_bytes)
    if requirement == "proof":
        return proof_ok(directory, min_bytes)
    if requirement == "review":
        return content_ok(directory / "05-review.md", min_bytes) and nonempty(
            directory / "review.json"
        )
    if requirement == "decisions":
        return decisions_ok(directory, min_bytes)
    raise GateError(f"requisito desconhecido no config: {requirement}", status=2)


def review_status(
    directory: Path,
    root: Path,
    head: str,
    min_reviewers: int,
    artifacts_root: str,
    review_paths: list[str] | None = None,
    min_evidence_bytes: int = 80,
) -> list[str]:
    path = directory / "review.json"
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        return [f"review.json ilegível: {exc}"]
    if not isinstance(data, dict):
        return ["review.json precisa ser um objeto"]
    if type(data.get("schema")) is not int or data.get("schema") != 1:
        return ["review.json schema precisa ser o inteiro 1"]
    if review_paths is not None and (
        not isinstance(review_paths, list)
        or not all(isinstance(item, str) and item.strip() for item in review_paths)
    ):
        return ["review_artifacts_paths precisa ser lista de strings"]
    problems: list[str] = []
    required_keys = {"schema", "head", "intent", "verdict", "reviewers", "findings"}
    missing = sorted(required_keys - set(data))
    if missing:
        problems.append(f"review.json não tem {', '.join(missing)}")
    if not str(data.get("intent") or "").strip():
        problems.append("review.json intent vazio")
    elif "PREENCHER" in str(data.get("intent") or "").upper():
        problems.append("review.json intent ainda tem placeholder")
    review_head = str(data.get("head") or "").strip().lower()
    if not re.fullmatch(r"[0-9a-f]{7,40}", review_head):
        problems.append("review.json head precisa ter 7–40 hex chars")
    else:
        ancestor = run(
            ["git", "merge-base", "--is-ancestor", review_head, head], root
        )
        if ancestor.returncode != 0:
            problems.append(
                f"review.json head {review_head} não é ancestral de {head[:12]}"
            )
        elif review_head != head:
            changed = git_names(root, f"{review_head}..{head}")
            allowed = review_paths or [artifacts_root.rstrip("/") + "/"]
            for changed_path in changed:
                if not any(
                    changed_path == prefix.rstrip("/")
                    or changed_path.startswith(prefix.rstrip("/") + "/")
                    for prefix in allowed
                ):
                    problems.append(
                        "review stale: "
                        f"{changed_path} mudou depois do head revisado"
                    )
                    break
            parent = run(["git", "rev-parse", f"{review_head}^"], root)
            if parent.returncode == 0:
                at_head = git_names(root, f"{review_head}^..{review_head}")
                if at_head and all(
                    path == artifacts_root.rstrip("/")
                    or path.startswith(artifacts_root.rstrip("/") + "/")
                    for path in at_head
                ):
                    problems.append(
                        "review.json head é commit de artefatos; "
                        "use o commit de código revisado"
                    )
            # O review.json existente no head revisado não pode ser trocado
            # depois (ex.: CHANGES_REQUESTED -> APPROVED pelo autor). Se ele
            # ainda não existia, a adição posterior é o fluxo normal.
            try:
                review_rel = path.resolve().relative_to(root.resolve()).as_posix()
            except ValueError:
                review_rel = ""
            if review_rel:
                original = run(
                    ["git", "show", f"{review_head}:{review_rel}"], root
                )
                if original.returncode == 0:
                    try:
                        current_text = path.read_text(encoding="utf-8")
                    except OSError:
                        current_text = ""
                    if original.stdout != current_text:
                        problems.append(
                            "review.json mudou depois do head revisado; "
                            "re-revise o head atual"
                        )
    verdict = str(data.get("verdict") or "").strip().upper()
    if verdict != "APPROVED":
        problems.append(f"review.json verdict={verdict or 'ausente'} (esperado APPROVED)")
    else:
        human_review = directory / "05-review.md"
        if human_review.is_file():
            try:
                human_text = human_review.read_text(
                    encoding="utf-8", errors="surrogateescape"
                )
            except OSError:
                human_text = ""
            current_verdict = ""
            for line in human_text.splitlines():
                if re.match(r"^\s*##\s+Hist[oó]rico", line, re.I):
                    break
                match = re.match(
                    r"^\s*(?:[-*]\s*)?\*\*Veredito:\*\*\s*([A-Z_]+)",
                    line,
                    re.I,
                )
                if match:
                    current_verdict = match.group(1).upper()
                    break
            if current_verdict in {
                "CHANGES_REQUESTED",
                "REPROVADO",
                "BLOCKED",
                "REJECTED",
            }:
                problems.append(
                    "05-review.md contradiz review.json "
                    f"({current_verdict})"
                )
    reviewers = data.get("reviewers")
    if not isinstance(reviewers, list):
        problems.append("review.json reviewers precisa ser lista")
        reviewers = []
    valid_reviewers = [
        item.strip()
        for item in reviewers
        if isinstance(item, str) and item.strip()
    ]
    if len(valid_reviewers) != len(reviewers):
        problems.append("review.json reviewers tem item vazio/não-string")
    if len(set(valid_reviewers)) != len(valid_reviewers):
        problems.append("review.json reviewers tem duplicata")
    if len(valid_reviewers) < min_reviewers:
        problems.append(
            f"review.json tem {len(valid_reviewers)} revisor(es); mínimo {min_reviewers}"
        )
    findings = data.get("findings")
    if not isinstance(findings, list):
        problems.append("review.json findings precisa ser lista")
        findings = []
    for finding in findings:
        if not isinstance(finding, dict):
            problems.append("review.json finding precisa ser objeto")
            continue
        severity = str(finding.get("severity") or "").strip().upper()
        decision = str(finding.get("decision") or "").strip().lower()
        if any(
            token
            in str(finding.get(field) or "").lower()
            for field in ("title", "evidence")
            for token in ("<slug>", "<comando>", "<saída", "<lentes>", "preencher")
        ):
            problems.append(
                f"achado com placeholder: "
                f"{finding.get('id') or finding.get('title') or 'sem id'}"
            )
            continue
        if severity not in {"BLOCKER", "MAJOR", "MINOR", "NIT"}:
            problems.append(
                f"achado com severity inválida: "
                f"{finding.get('id') or finding.get('title') or 'sem id'}"
            )
            continue
        if severity in SEVERITIES_BLOCKING:
            for key in ("criterion", "evidence"):
                if not str(finding.get(key) or "").strip():
                    problems.append(
                        f"achado {severity} sem {key}: "
                        f"{finding.get('id') or finding.get('title') or 'sem id'}"
                    )
            criterion = str(finding.get("criterion") or "").strip().upper()
            if not re.fullmatch(r"C[1-8]", criterion):
                problems.append(
                    f"achado {severity} com criterion inválido: {criterion or 'ausente'}"
                )
            evidence = str(finding.get("evidence") or "").strip()
            if len(evidence) < min_evidence_bytes:
                problems.append(
                    f"achado {severity} com evidence curta: "
                    f"{finding.get('id') or finding.get('title') or 'sem id'}"
                )
            if decision not in {"act on", "consider", "noted", "dismissed"}:
                problems.append(
                    f"achado {severity} sem decision válida: "
                    f"{finding.get('id') or finding.get('title') or 'sem id'}"
                )
            elif decision == "dismissed":
                if not evidence:
                    problems.append(
                        f"achado {severity} dismissed sem evidence: "
                        f"{finding.get('id') or finding.get('title') or 'sem id'}"
                    )
            elif decision == "act on":
                status = str(finding.get("status") or "").strip().lower()
                if status not in {"fixed", "resolved"}:
                    problems.append(
                        f"achado {severity} act on sem status fixed/resolved: "
                        f"{finding.get('id') or finding.get('title') or 'sem id'}"
                    )
            else:
                problems.append(
                    f"achado {severity} {decision}: "
                    f"{finding.get('id') or finding.get('title') or 'sem id'}"
                )
    return problems


def validate_config(config: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    allowed_keys = {
        "version",
        "base",
        "artifacts_root",
        "stateful_paths",
        "risk_paths",
        "require",
        "stateful_require",
        "risk_require",
        "review_artifacts_paths",
        "min_reviewers",
        "min_evidence_bytes",
        "run_test_cmd",
        "test_cmd",
        "test_timeout_seconds",
        "allow_empty_paths",
        "domains",
        "domain_require",
        "release_require",
        "release_slug",
    }
    unknown = sorted(set(config) - allowed_keys)
    if unknown:
        errors.append("chaves desconhecidas: " + ", ".join(unknown))
    for key in (
        "stateful_paths",
        "risk_paths",
        "require",
        "stateful_require",
        "risk_require",
        "review_artifacts_paths",
    ):
        if key not in config:
            continue
        value = config[key]
        if not isinstance(value, list) or not all(
            isinstance(item, str) and item.strip() for item in value
        ):
            errors.append(f"{key} precisa ser lista de strings")
    if not config.get("allow_empty_paths") and not (
        config.get("stateful_paths")
        or config.get("risk_paths")
        or config.get("domains")
    ):
        errors.append("stateful_paths/risk_paths/domains não podem ser vazios")
    for key in ("allow_empty_paths", "run_test_cmd"):
        if key in config and not isinstance(config.get(key), bool):
            errors.append(f"{key} precisa ser booleano")
    if config.get("run_test_cmd") and not str(
        config.get("test_cmd") or ""
    ).strip():
        errors.append("run_test_cmd=true exige test_cmd")
    if "test_timeout_seconds" in config:
        timeout = config["test_timeout_seconds"]
        if type(timeout) is not int or timeout < 1:
            errors.append("test_timeout_seconds precisa ser inteiro >= 1")
    if not str(config.get("artifacts_root") or ".pstack").strip():
        errors.append("artifacts_root não pode ser vazio")
    domains = config.get("domains", {})
    if not isinstance(domains, dict):
        errors.append("domains precisa ser objeto")
        domains = {}
    else:
        for name, patterns in domains.items():
            if not isinstance(patterns, list) or not all(
                isinstance(item, str) and item.strip() for item in patterns
            ):
                errors.append(f"domains.{name} precisa ser lista de strings")
    domain_require = config.get("domain_require", {})
    if not isinstance(domain_require, dict):
        errors.append("domain_require precisa ser objeto")
    else:
        for name, requirements in domain_require.items():
            if name not in domains:
                errors.append(f"domain_require.{name} não existe em domains")
            if not isinstance(requirements, list) or not all(
                isinstance(item, str) and item.strip() for item in requirements
            ):
                errors.append(f"domain_require.{name} precisa ser lista de strings")
    if "release_require" in config:
        value = config["release_require"]
        if (
            not isinstance(value, list)
            or not value
            or not all(isinstance(item, str) and item.strip() for item in value)
        ):
            errors.append("release_require precisa ser lista não vazia de strings")
    value = config.get("min_evidence_bytes", 80)
    if type(value) is not int or value < 1:
        errors.append("min_evidence_bytes precisa ser inteiro >= 1")
    value = config.get("min_reviewers", 2)
    if type(value) is not int or value < 1:
        errors.append("min_reviewers precisa ser inteiro >= 1")
    return errors


def directory_touched(
    directory: Path, root: Path, changed: list[str]
) -> bool:
    try:
        rel = directory.resolve().relative_to(root.resolve()).as_posix()
    except ValueError:
        return False
    return any(path == rel or path.startswith(rel.rstrip("/") + "/") for path in changed)


def relevant_dirs(root: Path, slug: str | None, artifacts_root: str) -> list[Path]:
    base = root / artifacts_root
    if not base.is_dir():
        return []
    if slug:
        return [base / slug]
    return sorted(
        (path for path in base.iterdir() if path.is_dir()),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )


def choose_directory(
    root: Path,
    slug: str | None,
    requirements: list[str],
    artifacts_root: str,
    changed: list[str],
    allow_untracked: bool,
    min_bytes: int,
) -> tuple[Path | None, dict[Path, list[str]], list[Path]]:
    missing_by_dir: dict[Path, list[str]] = {}
    matched_dirs: list[Path] = []
    for directory in relevant_dirs(root, slug, artifacts_root):
        missing = [
            req for req in requirements if not artifact_ok(directory, req, min_bytes)
        ]
        if not allow_untracked and not directory_touched(directory, root, changed):
            missing.append("não faz parte do diff do PR")
        missing_by_dir[directory] = missing
        if not missing:
            matched_dirs.append(directory)
    if len(matched_dirs) > 1 and slug is None:
        return None, missing_by_dir, matched_dirs
    return (
        matched_dirs[0] if matched_dirs else None
    ), missing_by_dir, matched_dirs


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Valida o gate pstack de um PR no repo-alvo (lê .pstack/harness.json e exige review.json).",
    )
    parser.add_argument("--root", default=".", help="raiz do repo (default: .)")
    parser.add_argument("--base", default=None, help="ref base (default: config)")
    parser.add_argument("--slug", default=None, help="diretório .pstack/<slug> exato")
    parser.add_argument(
        "--release",
        action="store_true",
        help="modo release: exige release_require e slug release, sem paths do diff",
    )
    parser.add_argument(
        "--config",
        default=None,
        help="config explícito; default: pstack.json, .pstack/harness.json ou docs/pstack/harness.json",
    )
    parser.add_argument(
        "--artifacts-root",
        default=None,
        help="sobrescreve artifacts_root do config (ex.: docs/pstack)",
    )
    parser.add_argument("--no-test", action="store_true", help="não roda test_cmd")
    parser.add_argument(
        "--allow-untracked-artifacts",
        action="store_true",
        help="permite artefatos locais fora do diff (não use no CI)",
    )
    parser.add_argument(
        "--local",
        action="store_true",
        help=(
            "modo local: aceita config/artefatos fora da base e do diff; "
            "use no pre-flight do desenvolvedor, não no CI"
        ),
    )
    parser.add_argument("--json", action="store_true", help="saída JSON")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    root = Path(args.root).resolve()
    try:
        if args.config:
            working_path = root / args.config
            if not working_path.is_file():
                raise GateError(f"config ausente: {args.config}", status=2)
            try:
                working_config = json.loads(working_path.read_text(encoding="utf-8"))
            except ValueError as exc:
                raise GateError(f"{working_path} inválido: {exc}", status=2) from exc
        else:
            existing = [
                root / candidate
                for candidate in DEFAULT_CONFIG_CANDIDATES
                if (root / candidate).is_file()
            ]
            if not existing:
                raise GateError(
                    "sem config do gate; copie templates/harness.json para pstack.json "
                    "ou .pstack/harness.json",
                    status=2,
                )
            if len(existing) > 1:
                raise GateError(
                    "config do gate duplicado: "
                    + ", ".join(str(path.relative_to(root)) for path in existing),
                    status=2,
                )
            working_path = existing[0]
            try:
                working_config = json.loads(working_path.read_text(encoding="utf-8"))
            except ValueError as exc:
                raise GateError(f"{working_path} inválido: {exc}", status=2) from exc
        if not isinstance(working_config, dict):
            raise GateError("config do gate precisa ser objeto", status=2)

        head = git_head(root)
        base = args.base or str(working_config.get("base") or "origin/main")
        if os.environ.get("GITHUB_ACTIONS") == "true" and not args.base:
            raise GateError("--base é obrigatório no CI", status=2)
        base_result = run(["git", "rev-parse", base], root)
        if base_result.returncode == 0 and base_result.stdout.strip() == head:
            raise GateError(
                f"base {base!r} resolve para o HEAD; configure a base do PR",
                status=2,
            )

        # A politica vem da base quando ela ja tem config; um PR nao pode
        # enfraquecer stateful_paths/test_cmd no proprio diff.
        config = working_config
        try:
            config_source = str(working_path.relative_to(root))
        except ValueError:
            config_source = str(working_path)
        defaults = (
            ".pstack/harness.json",
            "pstack.json",
            "docs/pstack/harness.json",
        )
        candidates = (args.config,) if args.config else defaults

        def load_base(candidate: str) -> tuple[str, dict[str, Any]] | None:
            show = run(["git", "show", f"{base}:{candidate}"], root)
            if show.returncode != 0:
                return None
            try:
                base_config = json.loads(show.stdout)
            except ValueError as exc:
                raise GateError(
                    f"{base}:{candidate} inválido: {exc}", status=2
                ) from exc
            if not isinstance(base_config, dict):
                raise GateError(
                    f"{base}:{candidate} precisa ser objeto", status=2
                )
            return candidate, base_config

        # No modo local, a politica e o proprio arquivo de config (que pode
        # estar no operations repo). No CI, a base manda para o PR nao
        # enfraquecer o gate.
        base_configs: list[tuple[str, dict[str, Any]]] = []
        if not args.local:
            for candidate in candidates:
                loaded = load_base(candidate)
                if loaded is not None:
                    base_configs.append(loaded)
            if args.config and not base_configs:
                raise GateError(
                    f"config {args.config!r} não existe na base; "
                    "adicione-o na base antes de usar --config",
                    status=2,
                )
            if len(base_configs) > 1:
                raise GateError(
                    "config do gate duplicado na base: "
                    + ", ".join(candidate for candidate, _ in base_configs),
                    status=2,
                )
            if base_configs:
                candidate, config = base_configs[0]
                config_source = f"{base}:{candidate}"
        files = changed_files(root, base)
        if not files:
            print("pstack-gate: sem mudanças contra a base")
            return 0

        config_errors = validate_config(config)
        if config_errors:
            raise GateError("config inválido: " + "; ".join(config_errors), status=2)
        min_evidence = int(config.get("min_evidence_bytes", 80))
        artifacts_root = str(
            args.artifacts_root or config.get("artifacts_root") or ".pstack"
        )
        artifacts_prefix = artifacts_root.rstrip("/") + "/"
        config_paths = {
            "pstack.json",
            ".pstack/harness.json",
            "docs/pstack/harness.json",
        }
        if args.config:
            config_paths.add(args.config.replace("\\", "/"))

        def is_artifact_slug(path: str) -> bool:
            if not path.startswith(artifacts_prefix):
                return False
            relative = path[len(artifacts_prefix) :]
            first = relative.split("/", 1)[0]
            return first != "harness.json"

        classified = [
            path
            for path in files
            if path in config_paths or not is_artifact_slug(path)
        ]
        domains = config.get("domains") or {}
        domain_require = config.get("domain_require") or {}
        domains_hit = [
            name
            for name, patterns in domains.items()
            if any(matches(path, list(patterns)) for path in classified)
        ]
        if args.release:
            requirements = list(
                config["release_require"]
                if "release_require" in config
                else ["proof", "review", "blast_radius"]
            )
            target_slug = args.slug or str(config.get("release_slug") or "release")
            stateful = False
            risk = False
        else:
            stateful = any(
                matches(path, list(config.get("stateful_paths") or []))
                for path in classified
            )
            risk = any(
                matches(path, list(config.get("risk_paths") or []))
                for path in classified
            )
            requirements = list(
                config["require"]
                if "require" in config
                else ["proof", "review"]
            )
            if stateful:
                requirements += list(
                    config["stateful_require"]
                    if "stateful_require" in config
                    else ["statechart"]
                )
            if risk:
                requirements += list(
                    config["risk_require"]
                    if "risk_require" in config
                    else ["blast_radius"]
                )
            for name in domains_hit:
                requirements += list(
                    domain_require[name]
                    if name in domain_require
                    else ["blast_radius", "review"]
                )
            target_slug = args.slug
        requirements = list(dict.fromkeys(requirements))

        directory: Path | None = None
        missing_by_dir: dict[Path, list[str]] = {}
        matched_dirs: list[Path] = []
        if requirements:
            directory, missing_by_dir, matched_dirs = choose_directory(
                root,
                target_slug,
                requirements,
                artifacts_root,
                files,
                args.allow_untracked_artifacts or args.local,
                min_evidence,
            )
        if directory is None and len(matched_dirs) > 1:
            raise GateError(
                "mais de um diretório satisfaz os requisitos "
                f"({', '.join(path.name for path in matched_dirs)}); use --slug",
                status=2,
            )
        problems: list[str] = []
        if directory is None and requirements:
            detail = "; ".join(
                f"{path.name}: falta {', '.join(missing)}"
                for path, missing in missing_by_dir.items()
                if missing
            )
            problems.append(
                f"nenhum {artifacts_root}/<slug> satisfaz os requisitos"
                + (f" ({detail})" if detail else "")
            )
            directory = next(iter(missing_by_dir), None)

        if directory is not None and "review" in requirements:
            try:
                min_reviewers = int(config.get("min_reviewers", 2))
            except (TypeError, ValueError):
                min_reviewers = 2
            review_paths = config.get("review_artifacts_paths")
            problems.extend(
                review_status(
                    directory,
                    root,
                    head,
                    max(1, min_reviewers),
                    artifacts_root,
                    review_paths,
                    min_evidence,
                )
            )

        test_ok: bool | None = None
        test_cmd = str(config.get("test_cmd") or "").strip()
        if problems:
            if not args.json:
                print("pstack-gate: test_cmd não rodado (artefatos/config falharam)")
        elif not args.no_test and config.get("run_test_cmd"):
            timeout = int(config.get("test_timeout_seconds", 300))
            try:
                proc = subprocess.Popen(
                    test_cmd,
                    cwd=root,
                    shell=True,
                    text=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    encoding="utf-8",
                    errors="surrogateescape",
                    start_new_session=True,
                )
            except OSError as exc:
                test_ok = False
                problems.append(f"test_cmd não iniciou: {exc}")
            else:
                try:
                    stdout, stderr = proc.communicate(timeout=timeout)
                except subprocess.TimeoutExpired:
                    try:
                        os.killpg(os.getpgid(proc.pid), signal.SIGKILL)
                    except ProcessLookupError:
                        pass
                    stdout, stderr = proc.communicate()
                    test_ok = False
                    problems.append(f"test_cmd timeout após {timeout}s")
                    if not args.json:
                        print(
                            f"pstack-gate: test_cmd timeout após {timeout}s"
                        )
                else:
                    test_ok = proc.returncode == 0
                    if not test_ok:
                        problems.append(
                            f"test_cmd falhou (exit {proc.returncode})"
                        )
                    if not args.json:
                        print(f"pstack-gate: test_cmd exit={proc.returncode}")
                        if stdout.strip():
                            print(stdout.rstrip())
                        if stderr.strip():
                            print(stderr.rstrip(), file=sys.stderr)

        payload = {
            "schema": 1,
            "head": head,
            "base": base,
            "changed": len(files),
            "stateful": stateful,
            "risk": risk,
            "release": args.release,
            "local": args.local,
            "domains": domains_hit,
            "min_evidence_bytes": min_evidence,
            "requirements": requirements,
            "config_source": config_source,
            "directory": str(directory) if directory else None,
            "test_ok": test_ok,
            "problems": problems,
        }
        if args.json:
            print(json.dumps(payload, ensure_ascii=False, indent=2))
        else:
            print(
                f"pstack-gate: head={head[:12]} base={base} "
                f"changed={len(files)} stateful={stateful} risk={risk} "
                f"local={args.local}"
            )
            if not requirements:
                print("pstack-gate: sem requisitos para o diff")
            if domains_hit:
                print(f"pstack-gate: domínios={', '.join(domains_hit)}")
            print(f"pstack-gate: requisitos={', '.join(requirements)}")
            if directory:
                print(f"pstack-gate: artefatos={directory}")
            for problem in problems:
                print(f"FAIL  {problem}")
            if not problems:
                print("pstack-gate: ok")
        return 0 if not problems else 1
    except GateError as exc:
        print(f"pstack-gate: {exc}", file=sys.stderr)
        return exc.status


if __name__ == "__main__":
    sys.exit(main())
