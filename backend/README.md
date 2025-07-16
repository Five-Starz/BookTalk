
# 📗 Backend - BookTalk

Express + TypeScript 기반의 백엔드 프로젝트입니다.

---

## 🛠 기술 스택

- Node.js + Express
- TypeScript
- JWT (인증/인가)
- MongoDB 또는 MySQL
- ESLint + Prettier
- Swagger (API 문서화)

---

## ⚙️ 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev
```
- 개발 서버 주소: http://localhost:4000
---
## 📄 환경 변수 (.env 예시)
```ini
PORT=4000
JWT_SECRET=your_jwt_secret
DB_URI=mongodb://localhost:27017/booktalk
```
---
## 📁 주요 폴더 구조
```bash
src/
├── controllers/     # 라우트 핸들러
├── routes/          # API 라우팅
├── models/          # DB 모델
├── middlewares/     # 인증, 에러처리 등
├── app.ts           # express app 설정
└── index.ts         # 서버 실행 진입점
```
---
## 🧼 코드 스타일
- 저장 시 자동 포맷팅: Prettier
- 코드 검사: ESLint
- 설정 파일: .prettierrc, .eslintrc.js
---
## 📘 API 문서
- Swagger UI: 추후 /api-docs 경로에 연동 예정