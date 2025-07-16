module.exports = {
  root: true,
  env: {
    browser: true,    // 프론트엔드용
    node: true,       // 백엔드용
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "no-console": "warn",              // console.log는 경고로 둠
    "react/react-in-jsx-scope": "off" // React 17 이상은 React import 필요 없음
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};