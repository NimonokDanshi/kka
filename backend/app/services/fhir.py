import json
from pathlib import Path

base_dir = Path(__file__).resolve().parent.parent.parent

def get_patients() -> list[dict]:
    """
    mock_patients.json からデータを読み込んで返す
    """
    mock_file = base_dir / "mock_patients.json"
    if mock_file.exists():
        with open(mock_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def get_observations(patient_id: str = None) -> list[dict]:
    """
    mock_observations.json からデータを読み込んで返す。
    patient_id が指定されている場合はその患者のデータのみを返す。
    """
    mock_file = base_dir / "mock_observations.json"
    if not mock_file.exists():
        return []

    with open(mock_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    if patient_id:
        # patient_id は "Patient/1" または "1" の形式両方に対応
        target_ref = patient_id if patient_id.startswith("Patient/") else f"Patient/{patient_id}"
        data = [obs for obs in data if obs.get("subject", {}).get("reference") == target_ref]

    return data