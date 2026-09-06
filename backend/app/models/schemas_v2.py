"""Schemas da API v2 (portal comunitário — leitura pública).

Os artefatos são pré-computados por backend/jobs/build_basin.py; estes
schemas documentam o contrato e validam manifests/métodos. O GeoJSON de
trechos trafega como dict (arquivo versionado, já validado no build).
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class BasinInfo(BaseModel):
    basin: str
    versions: List[str] = Field(default_factory=list)
    latest: Optional[str] = None


class Manifest(BaseModel):
    basin: str
    built_at: str
    methods_version: str
    region: str
    n_reaches: int
    synthetic: bool = False


class Summary(BaseModel):
    basin: str
    n_reaches: int
    bands: Dict[str, int] = Field(default_factory=dict)
    score_mean: float = 0.0
    frac_critical_reaches: float = 0.0


class Methods(BaseModel):
    methods_version: str
    weights: Dict[str, float] = Field(default_factory=dict)
    text: str = ""


class ErrorDetail(BaseModel):
    detail: str
