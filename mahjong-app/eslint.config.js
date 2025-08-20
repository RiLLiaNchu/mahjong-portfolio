import { FlatCompat } from "@eslint/eslintrc";
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
];
