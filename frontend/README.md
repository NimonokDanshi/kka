This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
src/
├── app/                  # Next.js App Router (Routing, Layout)
│   ├── (auth)/           # 認証関連のルートグループ
│   ├── (dashboard)/      # メイン機能のルートグループ
│   │   └── patients/     # 患者別検査結果ページ
│   └── api/              # BFF層 (FHIR Serverとの通信、変換)
│       └── fhir/         # FHIR Proxy API
├── components/           # UIコンポーネント
│   ├── ui/               # shadcn/ui (npx shadcn-ui add で入る)
│   ├── common/           # 汎用コンポーネント (Layout, Header等)
│   └── domain/           # 医療ドメイン特有のUIパーツ
│       └── lab/          # 検査値バッジ、基準値インジケータ等
├── features/             # 【重要】ビジネスロジックごとのカプセル化
│   ├── patient-search/   # 患者検索機能
│   └── lab-results/      # 検体検査結果表示機能
│       ├── components/   # この機能専用の複合コンポーネント
│       ├── hooks/        # useLabResults 等の TanStack Query
│       ├── services/     # FHIRリソースの取得・変換ロジック
│       └── types/        # アプリ内での検査データの型定義
├── lib/                  # 共通ユーティリティ
│   ├── fhir/             # FHIRクライアント設定、共通マッパー
│   └── utils.ts          # shadcn/ui 用の clsx ユーティリティ
├── store/                # グローバル状態 (必要な場合のみ)
└── types/                # プロジェクト全体の型定義 (FHIRのリソース型等)
```
