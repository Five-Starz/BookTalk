# BookTalk 프로젝트

책 리뷰 커뮤니티 'BookTalk'은 사용자 리뷰 작성, 댓글, 좋아요, 맞춤형 추천, 외부 도서 API 연동 기능을 갖춘 웹 서비스입니다.  
본 프로젝트는 3주간 진행되며, 프론트엔드와 백엔드로 나누어 개발합니다.

---

## 📌 프로젝트 개요

- **주요 기능**
  - 회원가입/로그인 (JWT 인증)
  - 책 리뷰 CRUD (작성, 조회, 수정, 삭제)
  - 댓글 작성 및 삭제
  - 좋아요 기능
  - 책 검색 및 카테고리별 필터링
  - 외부 도서 API (카카오 도서 API) 연동
  - 맞춤형 도서 추천 시스템

- **기술 스택**
  - 프론트엔드: React, TypeScript, Vite, Axios
  - 백엔드: Node.js, Express, TypeScript, JWT
  - 데이터베이스: MySQL (또는 MongoDB)
  - 기타: ESLint, Prettier, Swagger(API 문서화)

---

## 📂 폴더 구조
```
BookTalk/
├── backend/ # 백엔드 코드 및 설정
├── frontend/ # 프론트엔드 코드 및 설정
├── README.md # 프로젝트 전체 개요 및 설명 (이 파일)
```
---
## ⚙️ 실행 방법

### 1. 백엔드

```bash
cd backend
npm install
npm run dev
```
- 서버 기본 주소: http://localhost:8000

### 2. 프론트엔드
```bash
cd frontend
npm install
npm run dev
```
- 개발 서버 기본 주소: http://localhost:5173
---
## 🧹 코드 스타일 및 협업 규칙
- 각 폴더별 .eslintrc.js 및 .prettierrc로 코드 스타일 통일
- VSCode에서 작업 시 아래 설정 권장 (각자 .vscode/settings.json에 추가)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```
- 커밋 메시지는 간결하게 (ex: feat: 로그인 기능 구현)
- 브랜치 전략: feature/xxx, fix/xxx 등
- PR 작성 후 팀원 리뷰 후 머지 진행
---
## 📅 일정
| 기간         | 주요 일정              |
| ---------- | ------------------ |
| 7/17 (수)   | 기획, 역할 분담, 기본 세팅   |
| 7/18\~7/21 | 기본 기능 개발 (로그인, 리뷰) |
| 7/22\~7/25 | 댓글, 좋아요, 검색 기능 완성  |
| 7/26\~7/29 | API 연동, UI 개선, 테스트 |
| 7/30 (화)   | 최종 제출 및 발표 준비      |
---
## 📌 참고 자료
- 카카오 도서 API 문서: https://developers.kakao.com/docs/latest/ko/daum-search/dev-guide#search-book
- ESLint + Prettier 공식 문서
- Swagger API 문서화 (백엔드에서 사용)
---
### 🎯 함께 협업하며 완성도 높은 프로젝트 만들어 봅시다!