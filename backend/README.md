# README – FastAPI バックエンド

## 📂 ディレクトリ構成
```
backend/
├─ app/
│  ├─ __init__.py
│  ├─ main.py            # FastAPI エントリーポイント
│  ├─ core/               # 将来の認証・GCP 連携用スタブ (現状空)
│  └─ services/
│      ├─ __init__.py
│      └─ fhir.py        # モック Observation データ取得ロジック
├─ mock_observations.json # サンプル Observation (5 件) → 開発時のテストデータ
└─ requirements.txt      # FastAPI, Uvicorn などの依存
```

## 🔧 前提条件
- Python 3.9 以上がインストールされていること
- `pip` が利用可能であること
- プロジェクトルートは `D:\011_自作ツール\td31kka\backend`

## 📦 依存パッケージのインストール
```powershell
cd D:\011_自作ツール\td31kka\backend
python -m pip install -r requirements.txt
```

## 🚀 開発サーバの起動
```powershell
# ルートディレクトリにいることを確認後
uvicorn app.main:app --reload
python -m uvicorn app.main:app --reload
```
- デフォルトで `http://127.0.0.1:8000` がリッスンされます
- `--reload` オプションによりコード変更時に自動再起動します

## ✅ ヘルスチェック & データ取得 API
| エンドポイント | 説明 | 例 (curl) |
|---|---|---|
| `/health` | アプリが起動しているかの簡易確認 | `curl http://127.0.0.1:8000/health` |
| `/observations` | モック Observation データ (JSON 配列) を返す | `curl http://127.0.0.1:8000/observations` |

## 📁 Synthea が出力した FHIR データの参照
本リポジトリの外部に **Synthea** が生成した FHIR データが置かれています。
- パス: `D:\011_自作ツール\Synthea\output\fhir`
- このディレクトリには以下のようなファイルが格納されています（例）:
  - `Patient-1.json`
  - `Observation-1.json`
  - `Observation-2.json`
- **活用イメージ**:
  1. `backend/mock_observations.json` の代わりに、Synthea の `Observation-*.json` を読み込むロジックを `services/fhir.py` に組み込むことが可能です。
  2. 現在はモックデータで動作確認していますが、実装段階で以下のように変更できます。

```python
import json, pathlib

def load_synthea_observations() -> list[dict]:
    base = pathlib.Path(r"D:\011_自作ツール\Synthea\output\fhir")
    observations = []
    for file in base.glob("Observation-*.json"):
        with open(file, "r", encoding="utf-8") as f:
            observations.append(json.load(f))
    return observations
```
- 上記関数を `get_observations()` から呼び出すだけで、実データへ切り替えられます。

## 🛠️ デバッグ・テスト
- ブラウザで `http://127.0.0.1:8000/observations` にアクセスし、JSON が正しく表示されるか確認してください。
- `curl` コマンドや Postman でエンドポイントを叩くと、ステータスコード 200 と JSON 配列が返ります。

## 📚 参考リンク
- FastAPI 公式ドキュメント: https://fastapi.tiangolo.com/
- Uvicorn (ASGI サーバ) 公式: https://www.uvicorn.org/
- Synthea 公式: https://github.com/synthetichealth/synthea

---
*この README はバックエンドだけの手順です。フロントエンド（Vite + React）については `frontend/README.md` をご参照ください。*
