# 機械学習予測システム - Reactフロントエンド

このプロジェクトは、Fast APIバックエンドと連携する**関数型プログラミング**の原則に基づいて構築されたReactフロントエンドアプリケーションです。

## 特徴

- **関数型プログラミング**: 不変性、純粋関数、Result型パターンを採用
- **型安全**: TypeScriptで完全に型付けされたコードベース
- **コンポーネント分離**: 再利用可能なプレゼンテーショナルコンポーネント
- **副作用の管理**: カスタムフックで副作用を明確に分離
- **パフォーマンス最適化**: React.memo、useMemo、useCallbackによるメモ化

## 機能

- 5つの特徴量を入力
- 機械学習モデルによる予測の実行
- 予測結果と信頼度の表示
- レスポンシブデザイン

## セットアップ

### 1. 依存関係のインストール

```bash
cd react-frontend
npm install
```

### 2. アプリケーションの実行

#### バックエンド（Fast API）の起動
```bash
# ルートディレクトリで
python api.py
```

#### フロントエンド（React）の起動
```bash
cd react-frontend
npm start
```

アプリケーションは http://localhost:3000 で利用できます。
APIサーバーは http://127.0.0.1:8100 で動作します。

## 使い方

1. Webブラウザで http://localhost:3000 にアクセス
2. 5つの特徴量フィールドに数値を入力
3. 「予測実行」ボタンをクリック
4. 予測結果（クラスと信頼度）が表示されます

## アーキテクチャ

このアプリケーションは関数型プログラミングの原則に従って設計されています：

### ファイル構成

```
react-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/           # UIコンポーネント
│   │   ├── FeatureInput.tsx     # 特徴量入力（memo化）
│   │   ├── ErrorDisplay.tsx     # エラー表示（memo化）
│   │   ├── PredictionDisplay.tsx # 予測結果表示（memo化）
│   │   └── index.ts             # コンポーネントエクスポート
│   ├── hooks/                # カスタムフック
│   │   └── usePrediction.ts     # API呼び出しと状態管理
│   ├── utils/                # ユーティリティ関数
│   │   └── featureValidation.ts # 純粋関数（検証・変換）
│   ├── App.tsx              # メインコンポーネント
│   ├── App.css              # スタイル
│   ├── index.tsx            # エントリーポイント
│   └── index.css            # グローバルスタイル
├── package.json             # 依存関係とスクリプト
└── README.md               # このファイル
```

### 関数型プログラミングの実装

#### 1. 不変性 (Immutability)
```typescript
// utils/featureValidation.ts
export const updateAtIndex = <T>(array: T[], index: number, value: T): T[] =>
  array.map((item, i) => i === index ? value : item);
```

#### 2. 純粋関数 (Pure Functions)
```typescript
// 副作用なし、同じ入力に対して常に同じ出力
export const parseNumber = (str: string): Result<number, string> => {
  const num = parseFloat(str);
  return isNaN(num)
    ? { success: false, error: `"${str}" は有効な数値ではありません` }
    : { success: true, data: num };
};
```

#### 3. Result型パターン (型安全なエラーハンドリング)
```typescript
export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };
```

#### 4. 副作用の分離
```typescript
// hooks/usePrediction.ts
// API呼び出しなどの副作用をカスタムフックで管理
export const usePrediction = () => {
  // 状態管理と副作用を1箇所に集約
};
```

#### 5. コンポーネントの合成
```typescript
// React.memoで純粋なコンポーネントを作成
export const FeatureInput = memo<FeatureInputProps>(({ index, value, onChange }) => {
  // プレゼンテーショナルコンポーネント
});
```

## 機能詳細

- **入力検証**: 純粋関数による型安全な検証（Result型パターン）
- **エラーハンドリング**: 例外を使わない、型安全なエラー処理
- **ローディング状態**: カスタムフックによる状態管理
- **レスポンシブデザイン**: モバイルデバイスに対応
- **信頼度表示**: useMemoによるメモ化された計算
- **パフォーマンス**: React.memo、useCallback、useMemoによる最適化

## ビルド

```bash
npm run build
```

本番環境用に最適化されたビルドが `build/` ディレクトリに生成されます。

## 開発のベストプラクティス

1. **純粋関数を優先**: 可能な限り純粋関数を使用
2. **不変性を維持**: 配列やオブジェクトを直接変更しない
3. **副作用を分離**: useEffectやカスタムフックで副作用を管理
4. **型安全性**: TypeScriptの型システムを最大限活用
5. **コンポーネント分離**: 小さく、再利用可能なコンポーネントを作成