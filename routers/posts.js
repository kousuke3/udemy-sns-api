// つぶやき投稿用API
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const isAuthenticated = require('../middlewares/isAuthenticated');

// つぶやきを投稿するAPI
router.post('/post', isAuthenticated, async (req, res) => {
  const { content } = req.body;
  const authorId = req.userId; // isAuthenticatedミドルウェアからユーザーIDを取得

  try {
    // 投稿データを作成し、投稿者の情報とそのプロフィール情報も取得する
    const post = await prisma.post.create({
      data: {
        content,
        authorId: authorId,
      },
      include: {
        author: {
          include: {
            profile: true, // 投稿者のプロフィール情報も含めて取得
          },
        },
      },
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 最新つぶやき取得用API
router.get('/get_latest_posts', async (req, res) => {
  console.log("getlatestpostsを実行")
  try {
    // 最新の10件のつぶやきを取得し、それぞれの投稿者の情報とプロフィール情報も取得する
    const latestPosts = await prisma.post.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          include: {
            profile: true, // 投稿者のプロフィール情報も含めて取得
          },
        },
      },
    });
    res.status(200).json(latestPosts);
  } catch (error) {
    console.log(`エラー発生:${error.message}`)
    res.status(500).json({ error: error.message });
  }
});

// 特定のユーザーの投稿を取得するAPI
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // 特定のユーザーの投稿を取得し、それぞれの投稿者の情報とプロフィール情報も取得する
    const userPosts = await prisma.post.findMany({
      where: {
        authorId: parseInt(userId),
      },
      include: {
        author: {
          include: {
            profile: true, // 投稿者のプロフィール情報も含めて取得
          },
        },
      },
    });
    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
