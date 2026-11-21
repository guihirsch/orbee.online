"""Testes do gate no repo-alvo (checker vendorizado do pstack-core).

Cobre o contrato que sustenta a camada de verdade: artefatos reais,
`review.json` com schema/head, ausência de placeholders, decisions.tsv
para risco, execução do test_cmd e matcher `**/`.
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHECKER = ROOT / "tools" / "check-consumer.py"

BASE_CONFIG = {
    "version": 1,
    "base": "HEAD~2",
    "artifacts_root": ".pstack",
    "review_artifacts_paths": [".pstack/"],
    "stateful_paths": ["app.py"],
    "risk_paths": ["app.py"],
    "require": ["proof", "review"],
    "stateful_require": ["statechart"],
    "risk_require": ["blast_radius", "decisions"],
    "min_reviewers": 1,
    "min_evidence_bytes": 80,
    "run_test_cmd": False,
}

FILLER = (
    "evidência real do teste, sem placeholder e com conteúdo suficiente. "
    "Saída de comando, exit code e caminho do artefato registrados."
)


def git(repo: Path, *args: str) -> None:
    subprocess.run(
        ["git", *args], cwd=repo, check=True, capture_output=True
    )


def run(repo: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(CHECKER), "--root", str(repo), *args],
        text=True,
        capture_output=True,
        check=False,
    )


def make_repo(tmp: str, **overrides: object) -> tuple[Path, str, str]:
    repo = Path(tmp)
    git(repo, "init", "-q")
    git(repo, "config", "user.email", "t@example.com")
    git(repo, "config", "user.name", "T")
    git(repo, "config", "commit.gpgsign", "false")
    (repo / "app.py").write_text("state = 'base'\n", encoding="utf-8")
    config = dict(BASE_CONFIG)
    config.update(overrides)
    (repo / "pstack.json").write_text(
        json.dumps(config), encoding="utf-8"
    )
    git(repo, "add", ".")
    git(repo, "commit", "-qm", "base")
    base = subprocess.run(
        ["git", "rev-parse", "HEAD"],
        cwd=repo,
        check=True,
        text=True,
        capture_output=True,
    ).stdout.strip()
    (repo / "app.py").write_text("state = 'novo'\n", encoding="utf-8")
    git(repo, "add", ".")
    git(repo, "commit", "-qm", "mudanca")
    head = subprocess.run(
        ["git", "rev-parse", "HEAD"],
        cwd=repo,
        check=True,
        text=True,
        capture_output=True,
    ).stdout.strip()
    return repo, base, head


def write_artifacts(
    repo: Path, head: str, *, decisions: bool = True
) -> Path:
    directory = repo / ".pstack" / "demo"
    (directory / "statechart" / "out").mkdir(parents=True, exist_ok=True)
    (directory / "statechart" / "SPEC.tla").write_text(
        f"---- MODULE SPEC ----\n\\* {FILLER}\n====\n", encoding="utf-8"
    )
    (directory / "statechart" / "out" / "report.md").write_text(
        f"# report\n{FILLER}\n", encoding="utf-8"
    )
    (directory / "06-prova.md").write_text(
        f"# prova\n{FILLER}\n", encoding="utf-8"
    )
    (directory / "05-blast-radius.md").write_text(
        f"# blast\n{FILLER}\n", encoding="utf-8"
    )
    (directory / "05-review.md").write_text(
        f"# review\n{FILLER}\n", encoding="utf-8"
    )
    (directory / "review.json").write_text(
        json.dumps(
            {
                "schema": 1,
                "head": head,
                "intent": "teste do gate",
                "verdict": "APPROVED",
                "reviewers": ["teste"],
                "findings": [],
            }
        ),
        encoding="utf-8",
    )
    if decisions:
        (directory / "decisions.tsv").write_text(
            "timestamp\tdecision\tevidence\towner\n"
            "2026-11-18T00:00:00Z\tmanter\tcommit abc\tagent:teste\n",
            encoding="utf-8",
        )
    git(repo, "add", ".")
    git(repo, "commit", "-qm", "artefatos")
    return directory


class GateTest(unittest.TestCase):
    def test_gate_passa_com_artefatos_e_decisions(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo, base, head = make_repo(
                tmp, run_test_cmd=True, test_cmd="exit 0"
            )
            write_artifacts(repo, head)
            result = run(repo, "--base", base)
            self.assertEqual(
                result.returncode, 0, result.stdout + result.stderr
            )
            self.assertIn("pstack-gate: ok", result.stdout)

    def test_placeholder_reprova(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo, base, head = make_repo(tmp)
            directory = write_artifacts(repo, head)
            (directory / "06-prova.md").write_text(
                "# prova\nPREENCHER com a saída\n", encoding="utf-8"
            )
            git(repo, "add", ".")
            git(repo, "commit", "-qm", "placeholder")
            result = run(repo, "--base", base)
            self.assertEqual(result.returncode, 1)
            self.assertIn("falta proof", result.stdout)

    def test_schema_ausente_reprova(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo, base, head = make_repo(tmp)
            directory = write_artifacts(repo, head)
            data = json.loads(
                (directory / "review.json").read_text(encoding="utf-8")
            )
            data.pop("schema")
            (directory / "review.json").write_text(
                json.dumps(data), encoding="utf-8"
            )
            git(repo, "add", ".")
            git(repo, "commit", "-qm", "sem schema")
            result = run(repo, "--base", base)
            self.assertEqual(result.returncode, 1)
            self.assertIn("schema", result.stdout)

    def test_decisions_obrigatorio_para_risk(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo, base, head = make_repo(tmp)
            write_artifacts(repo, head, decisions=False)
            result = run(repo, "--base", base)
            self.assertEqual(result.returncode, 1)
            self.assertIn("falta decisions", result.stdout)

    def test_test_cmd_falha_reprova(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo, base, head = make_repo(
                tmp, run_test_cmd=True, test_cmd="exit 1"
            )
            write_artifacts(repo, head)
            result = run(repo, "--base", base)
            self.assertEqual(result.returncode, 1)
            self.assertIn("test_cmd falhou", result.stdout)

    def test_matcher_duplo_asterisco_exige_statechart(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo, base, head = make_repo(tmp, stateful_paths=["**/app.py"])
            directory = write_artifacts(repo, head)
            (directory / "statechart" / "SPEC.tla").unlink()
            git(repo, "add", ".")
            git(repo, "commit", "-qm", "sem statechart")
            result = run(repo, "--base", base)
            self.assertEqual(result.returncode, 1)
            self.assertIn("falta statechart", result.stdout)

    def test_decisions_header_incompleto_reprova(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo, base, head = make_repo(tmp)
            directory = write_artifacts(repo, head)
            (directory / "decisions.tsv").write_text(
                "timestamp\tdecision\tevidence\n"
                "2026-11-18T00:00:00Z\tmanter\tcommit abc\n",
                encoding="utf-8",
            )
            git(repo, "add", ".")
            git(repo, "commit", "-qm", "header incompleto")
            result = run(repo, "--base", base)
            self.assertEqual(result.returncode, 1)
            self.assertIn("falta decisions", result.stdout)

    def test_decisions_linha_invalida_reprova(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo, base, head = make_repo(tmp)
            directory = write_artifacts(repo, head)
            (directory / "decisions.tsv").write_text(
                "timestamp\tdecision\tevidence\towner\n"
                + ("x" * 90)
                + "\n",
                encoding="utf-8",
            )
            git(repo, "add", ".")
            git(repo, "commit", "-qm", "linha invalida")
            result = run(repo, "--base", base)
            self.assertEqual(result.returncode, 1)
            self.assertIn("falta decisions", result.stdout)

    def test_decisions_placeholder_reprova(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo, base, head = make_repo(tmp)
            directory = write_artifacts(repo, head)
            (directory / "decisions.tsv").write_text(
                "timestamp\tdecision\tevidence\towner\n"
                "2026-11-18T00:00:00Z\tPREENCHER\tcommit abc\tagent:teste\n",
                encoding="utf-8",
            )
            git(repo, "add", ".")
            git(repo, "commit", "-qm", "placeholder decisions")
            result = run(repo, "--base", base)
            self.assertEqual(result.returncode, 1)
            self.assertIn("falta decisions", result.stdout)

    def test_config_invalida_reprova(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo, base, head = make_repo(tmp, typo_key=1)
            write_artifacts(repo, head)
            result = run(repo, "--base", base)
            self.assertEqual(result.returncode, 2)
            self.assertIn("chaves desconhecidas", result.stdout + result.stderr)

    def test_test_cmd_timeout_reprova(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo, base, head = make_repo(
                tmp,
                run_test_cmd=True,
                test_cmd="sleep 2",
                test_timeout_seconds=1,
            )
            write_artifacts(repo, head)
            result = run(repo, "--base", base)
            self.assertEqual(result.returncode, 1)
            self.assertIn("timeout", result.stdout)

    def test_decisions_header_errado_reprova(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo, base, head = make_repo(tmp)
            directory = write_artifacts(repo, head)
            (directory / "decisions.tsv").write_text(
                "timestamp\tdecision\tevidence\towner_errado\n"
                "2026-11-18T00:00:00Z\tmanter\tcommit abc\tagent:teste\n",
                encoding="utf-8",
            )
            git(repo, "add", ".")
            git(repo, "commit", "-qm", "header errado")
            result = run(repo, "--base", base)
            self.assertEqual(result.returncode, 1)
            self.assertIn("falta decisions", result.stdout)

    def test_decisions_header_only_reprova(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo, base, head = make_repo(tmp)
            directory = write_artifacts(repo, head)
            (directory / "decisions.tsv").write_text(
                "timestamp\tdecision\tevidence\towner" + (" " * 80) + "\n",
                encoding="utf-8",
            )
            git(repo, "add", ".")
            git(repo, "commit", "-qm", "header only")
            result = run(repo, "--base", base)
            self.assertEqual(result.returncode, 1)
            self.assertIn("falta decisions", result.stdout)

    def test_decisions_bom_passa(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo, base, head = make_repo(tmp)
            directory = write_artifacts(repo, head)
            (directory / "decisions.tsv").write_text(
                "timestamp\tdecision\tevidence\towner\n"
                "2026-11-18T00:00:00Z\tmanter\tcommit abc\tagent:teste\n",
                encoding="utf-8-sig",
            )
            git(repo, "add", ".")
            git(repo, "commit", "-qm", "bom")
            result = run(repo, "--base", base)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertIn("pstack-gate: ok", result.stdout)

    def test_decisions_bytes_invalidos_sem_traceback(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo, base, head = make_repo(tmp)
            directory = write_artifacts(repo, head)
            (directory / "decisions.tsv").write_bytes(
                b"timestamp\tdecision\tevidence\towner\n"
                b"2026-11-18T00:00:00Z\tmanter\tcommit abc\tagent:\xff\n"
            )
            git(repo, "add", ".")
            git(repo, "commit", "-qm", "bytes invalidos")
            result = run(repo, "--base", base)
            self.assertNotIn("Traceback", result.stdout + result.stderr)
            self.assertIn("pstack-gate:", result.stdout)

    def test_timeout_invalido_reprova(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo, base, head = make_repo(tmp, test_timeout_seconds=0)
            write_artifacts(repo, head)
            result = run(repo, "--base", base)
            self.assertEqual(result.returncode, 2)
            self.assertIn("test_timeout_seconds", result.stdout + result.stderr)

    def test_test_cmd_timeout_mata_filho(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            marker = Path(tmp) / "nao-deveria-existir"
            repo, base, head = make_repo(
                tmp,
                run_test_cmd=True,
                test_cmd=f"sleep 2; touch {marker}",
                test_timeout_seconds=1,
            )
            write_artifacts(repo, head)
            result = run(repo, "--base", base)
            self.assertEqual(result.returncode, 1)
            self.assertIn("timeout", result.stdout)
            self.assertFalse(marker.exists(), "filho do test_cmd sobreviveu")


if __name__ == "__main__":
    unittest.main()
