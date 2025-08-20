import { FlatCompat } from "@eslint/eslintrc";
import tsParser from "@typescript-eslint/parser"; // ←これが重要
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const compat = new FlatCompat({
    recommendedConfig: {},
    baseDirectory: __dirname,
});

export default [
    ...compat.extends("eslint:recommended"),
    ...compat.extends("plugin:@typescript-eslint/recommended"),
    ...compat.extends("next/core-web-vitals"),

    {
        languageOptions: {
            parser: tsParser, // ←文字列じゃなくて import したオブジェクト
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
                project: "./tsconfig.json",
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_" },
            ],
        },
    },
];
