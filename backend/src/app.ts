// express 앱 설정만 (라우터 등록, 미들웨어 등)
import express from 'express';
import bookRouter from './routes/book.routes';

const app = express();

app.use(express.json());
app.use('/api/books', bookRouter);

export default app;