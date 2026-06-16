// src/routes/depoimentos.routes.js
const router = require('express').Router();
const controller = require('../controllers/depoimentos.controller');

router.get('/', controller.listarTodos);

module.exports = router;
