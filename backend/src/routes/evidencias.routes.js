// src/routes/evidencias.routes.js
const router = require('express').Router();
const controller = require('../controllers/evidencias.controller');

router.get('/', controller.listarTodas);
router.get('/:id', controller.buscarPorId);

module.exports = router;
