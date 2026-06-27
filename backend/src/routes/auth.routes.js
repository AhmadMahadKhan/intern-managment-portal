const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');
const { loginValidator } = require('../validators/auth.validator');

router.post('/login', loginValidator, login);

module.exports = router;