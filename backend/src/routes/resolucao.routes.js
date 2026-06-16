// src/routes/resolucao.routes.js
const router = require('express').Router();
const controller = require('../controllers/resolucao.controller');

router.post('/', controller.resolver);

module.exports = router;
