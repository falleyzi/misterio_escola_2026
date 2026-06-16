// src/routes/ranking.routes.js
const router = require('express').Router();
const controller = require('../controllers/ranking.controller');

router.get('/', controller.listarTop10);
router.post('/', controller.registrar);

module.exports = router;
