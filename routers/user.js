const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ユーザープロフィールを取得するAPI
router.get('/profile/:userId', async (req, res) => {
  console.log("profile情報の取得を実行");
  const { userId } = req.params;
  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: parseInt(userId),
      },
      include: {
        user: {
          include: {
            posts: true, // ユーザーの投稿も含めて取得
          },
        },
      },
    });
    if (profile) {
      console.log(profile);
      res.status(200).json(profile);
    } else {
      res.status(404).json({ message: 'プロフィールが見つかりません。' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const isAuthenticated = require('../middlewares/isAuthenticated');

// ユーザー情報を取得するAPI
router.get('/find', isAuthenticated, async (req, res) => {
  const userId = req.userId; // isAuthenticatedミドルウェアからユーザーIDを取得
  console.log(userId);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        // パスワードは除外
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません。' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
