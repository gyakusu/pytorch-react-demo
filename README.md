# 機械学習予測システム

PyTorch + FastAPI + React（TypeScript）を使用した機械学習予測システムのフルスタックアプリケーションです。フロントエンドは**関数型プログラミング**の原則に基づいて設計されています。

## 概要

このプロジェクトは、機械学習モデル（PyTorch）を使った予測システムで、以下の3つの主要コンポーネントで構成されています：

1. **バックエンド（FastAPI）**: PyTorchモデルの推論APIを提供
2. **フロントエンド（React + TypeScript）**: 関数型プログラミングで構築されたユーザーインターフェース
3. **機械学習モデル（PyTorch）**: シンプルなニューラルネットワークモデル

## 技術スタック

### バックエンド
- **Python 3.x**
- **FastAPI**: 高速なAPIフレームワーク
- **PyTorch**: 機械学習フレームワーク
- **Uvicorn**: ASGIサーバー
- **Pydantic**: データバリデーション

### フロントエンド
- **React 18**: UIライブラリ
- **TypeScript**: 型安全なJavaScript
- **関数型プログラミング**: 不変性、純粋関数、Result型パターン
- **React Hooks**: カスタムフック（usePrediction）
- **CSS3**: レスポンシブデザイン

## プロジェクト構成

```
.
├── api.py                      # FastAPIバックエンド
├── react-frontend/             # Reactフロントエンド
│   ├── src/
│   │   ├── components/         # UIコンポーネント（memo化）
│   │   │   ├── FeatureInput.tsx
│   │   │   ├── ErrorDisplay.tsx
│   │   │   └── PredictionDisplay.tsx
│   │   ├── hooks/              # カスタムフック
│   │   │   └── usePrediction.ts
│   │   ├── utils/              # 純粋関数ユーティリティ
│   │   │   └── featureValidation.ts
│   │   ├── App.tsx             # メインコンポーネント
│   │   └── index.tsx           # エントリーポイント
│   ├── package.json
│   └── README.md
└── README.md                   # このファイル
```

## 機能

- 5つの特徴量を入力してモデルによる予測を取得
- 予測クラスと信頼度をリアルタイムで表示
- 型安全なエラーハンドリング（Result型パターン）
- レスポンシブデザイン
- CORSに対応したAPI通信

## セットアップ

### 必要な環境

- Python 3.8以上
- Node.js 16以上
- npm または yarn

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd hoge
```

### 2. バックエンドのセットアップ

#### Pythonの仮想環境を作成・有効化

```bash
python -m venv .venv
source .venv/bin/activate  # Linuxの場合
# または
.venv\Scripts\activate     # Windowsの場合
```

#### 依存関係のインストール

```bash
pip install fastapi uvicorn torch pydantic nest-asyncio
```

#### APIサーバーの起動

```bash
python api.py
```

APIサーバーは http://127.0.0.1:8100 で起動します。

### 3. フロントエンドのセットアップ

#### 依存関係のインストール

```bash
cd react-frontend
npm install
```

#### 開発サーバーの起動

```bash
npm start
```

アプリケーションは http://localhost:3000 で起動します。

## 使い方

1. バックエンドとフロントエンドの両方を起動
2. ブラウザで http://localhost:3000 にアクセス
3. 5つの特徴量フィールドに数値を入力
4. 「予測実行」ボタンをクリック
5. 予測結果（クラスと信頼度）が表示されます

## API仕様

### エンドポイント

#### `GET /`
APIの状態を確認

**レスポンス:**
```json
{
  "message": "機械学習予測API",
  "status": "running"
}
```

#### `POST /predict`
機械学習モデルによる予測を実行

**リクエスト:**
```json
{
  "features": [1.0, 2.0, 3.0, 4.0, 5.0]
}
```

**レスポンス:**
```json
{
  "prediction": 0,
  "confidence": 0.7234
}
```

#### `OPTIONS /predict`
CORSプリフライトリクエストに対応

## フロントエンドの特徴

このプロジェクトのフロントエンドは、関数型プログラミングのベストプラクティスに従って設計されています：

### 1. 不変性 (Immutability)
配列やオブジェクトを直接変更せず、常に新しい値を生成します。

```typescript
const updateAtIndex = <T>(array: T[], index: number, value: T): T[] =>
  array.map((item, i) => i === index ? value : item);
```

### 2. 純粋関数 (Pure Functions)
副作用がなく、同じ入力に対して常に同じ出力を返す関数を使用します。

```typescript
export const parseNumber = (str: string): Result<number, string> => {
  const num = parseFloat(str);
  return isNaN(num)
    ? { success: false, error: `"${str}" は有効な数値ではありません` }
    : { success: true, data: num };
};
```

### 3. Result型パターン
例外を使わない、型安全なエラーハンドリングを実装しています。

```typescript
type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };
```

### 4. 副作用の分離
カスタムフック（usePrediction）で副作用を管理し、ビジネスロジックから分離しています。

### 5. パフォーマンス最適化
- `React.memo`: 不要な再レンダリングを防止
- `useCallback`: 関数の安定化
- `useMemo`: 計算結果のキャッシュ

詳細は [react-frontend/README.md](react-frontend/README.md) を参照してください。

## 開発

### フロントエンドのビルド

```bash
cd react-frontend
npm run build
```

本番環境用に最適化されたビルドが `react-frontend/build/` に生成されます。

### 型チェック

```bash
cd react-frontend
npx tsc --noEmit
```

### リント

```bash
cd react-frontend
npm run lint
```

## 開発のベストプラクティス

### バックエンド
- Pydanticモデルを使用した型安全なデータバリデーション
- CORS設定を適切に管理
- エラーハンドリングを実装

### フロントエンド
- 純粋関数を優先
- 不変性を維持
- 副作用をカスタムフックで管理
- TypeScriptの型システムを最大限活用
- 小さく再利用可能なコンポーネントを作成

## トラブルシューティング

### CORSエラーが発生する場合
`api.py` の `allow_origins` にフロントエンドのURLが含まれているか確認してください。

### ポートが使用中の場合
- バックエンド: `api.py` の `port=8100` を別のポートに変更
- フロントエンド: `PORT=3001 npm start` のように環境変数で指定

### 依存関係のエラー
```bash
# バックエンド
pip install --upgrade pip
pip install -r requirements.txt  # requirements.txtがある場合

# フロントエンド
cd react-frontend
rm -rf node_modules package-lock.json
npm install
```

## ライセンス

このプロジェクトはサンプルプロジェクトです。

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 参考リンク

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [PyTorch Documentation](https://pytorch.org/docs/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [関数型プログラミング](https://en.wikipedia.org/wiki/Functional_programming)
