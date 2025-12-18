import torch
import torch.nn as nn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import nest_asyncio

# 1. 非常にシンプルなPyTorchモデルの定義（例）
class SimpleModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Linear(5, 2) # 5つの入力から2つの出力を出す
    def forward(self, x):
        return self.fc(x)

model = SimpleModel()
model.eval()

# 2. FastAPIの設定
app = FastAPI()
nest_asyncio.apply() # Jupyter上でFastAPIを動かすための設定

# CORSの設定（Reactアプリからのアクセスを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3100",
        "http://127.0.0.1:3100"
    ],  # Reactアプリのオリジン
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # OPTIONSを明示的に許可
    allow_headers=["*"],
)

# 3. I/O（入力と出力）の形を定義する
class PredictionInput(BaseModel):
    features: list[float]  # 例: [1.2, 0.5, 3.1, 0.8, 2.2]

class PredictionOutput(BaseModel):
    prediction: int
    confidence: float

# 4. エンドポイント（窓口）の作成
@app.get("/")
async def root():
    return {"message": "機械学習予測API", "status": "running"}

@app.options("/predict")
async def predict_options():
    return {"message": "OK"}

@app.post("/predict", response_model=PredictionOutput)
async def predict(data: PredictionInput):
    # 受け取ったデータをTensorに変換
    input_tensor = torch.tensor([data.features])
    
    # 推論実行
    with torch.no_grad():
        output = model(input_tensor)
        prob = torch.softmax(output, dim=1)
        pred_class = torch.argmax(prob).item()
        conf = torch.max(prob).item()
    
    # 結果を返却
    return {"prediction": pred_class, "confidence": conf}

# 5. サーバーの起動（Jupyter内で実行）
if __name__ == "__main__":
    print("APIサーバーを起動します... 停止するにはセルを中断してください。")
    uvicorn.run(app, host="127.0.0.1", port=8100)