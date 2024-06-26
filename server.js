const express = require('express');
const app = express();
const authRoute = require('./routers/auth');
const postsRoute = require('./routers/posts');
const userRoute = require('./routers/user');
const cors = require('cors');

require('dotenv').config();

app.use(
  cors({
    origin: 'https://udemy-sns-frontend.vercel.app', // ReactアプリケーションのURL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 許可するHTTPメソッド
    credentials: true, // 認証情報を含むリクエストを許可する場合
  }),
);
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/posts', postsRoute);
app.use('/api/users', userRoute);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));
