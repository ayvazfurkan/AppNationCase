const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const router = express.Router();

router.use('/auth', authRoutes);
router.use(userRoutes);

module.exports = router;
