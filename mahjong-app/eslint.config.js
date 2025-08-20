import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default [
    // ESLintの推奨設定
    ...compat.extends("eslint:recommended"),
    // TypeScript用の推奨設定
    ...compat.extends("plugin:@typescript-eslint/recommended"),
    // Next.js Core Web Vitals 推奨設定
    ...compat.extends("next/core-web-vitals"),
];
