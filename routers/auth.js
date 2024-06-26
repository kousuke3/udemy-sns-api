const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateIdenticon = require('../utils/generateIdenticon');

// 新規ユーザー登録API
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const saltRounds = 10;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    console.log('User created:', user);

    const identicon = await generateIdenticon(user.id);
    console.log('Identicon generated:', identicon);

    const profile = await prisma.profile.create({
      data: {
        bio: 'はじめまして',
        imageUrl: identicon,
        userId: user.id,
      },
    });
    res.status(201).json({ user, profile });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ error: error.message });
  }
});

// ユーザーログインAPI
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません。' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'パスワードが一致しません。' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn: '24h',
    });
    res.status(200).json({ message: 'ログイン成功！', token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
