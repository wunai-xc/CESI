// eslint.config.mjs
// ESLint 配置：直接用 eslint-config-next 的 core-web-vitals + TypeScript 规则，
// 并忽略构建产物与自动生成的类型文件。

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // 覆盖 eslint-config-next 的默认忽略项
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
