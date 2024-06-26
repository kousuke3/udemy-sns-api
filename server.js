const express = require('express');
const app = express();
const authRoute = require('./routers/auth');
const postsRoute = require('./routers/posts');
const userRoute = require('./routers/user');
const cors = require('cors');

require('dotenv').config();

const allowedOriginPattern = /^https:\/\/udemy-sns-frontend\./;

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOriginPattern.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/posts', postsRoute);
app.use('/api/users', userRoute);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));
