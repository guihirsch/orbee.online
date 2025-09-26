from __future__ import annotations
from typing import Any, Optional, Tuple
from datetime import datetime, timedelta


class InMemoryTTLCache:
    def __init__(self):
        self._store: dict[str, Tuple[Any, datetime]] = {}

    def set(self, key: str, value: Any, ttl_seconds: int = 3600) -> None:
        self._store[key] = (value, datetime.utcnow() + timedelta(seconds=ttl_seconds))

    def get(self, key: str) -> Optional[Any]:
        data = self._store.get(key)
        if not data:
            return None
        value, expires_at = data
        if datetime.utcnow() > expires_at:
            self._store.pop(key, None)
            return None
        return value

    def delete(self, key: str) -> None:
        self._store.pop(key, None)


cache = InMemoryTTLCache()


