import json
from pathlib import Path

def get_observations() -> list[dict]:
    """
    mock_observations.json からデータを読み込んで返す
    """
    # backend ディレクトリ直下の mock_observations.json のパスを取得
    base_dir = Path(__file__).resolve().parent.parent.parent
    mock_file = base_dir / "mock_observations.json"

    if mock_file.exists():
        with open(mock_file, "r", encoding="utf-8") as f:
            return json.load(f)
    
    return []