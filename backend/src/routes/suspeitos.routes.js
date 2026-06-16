// src/routes/suspeitos.routes.js
const router = require('express').Router();
const controller = require('../controllers/suspeitos.controller');

router.get('/', controller.listarTodos);
router.get('/:id', controller.buscarPorId);
router.get('/:id/evidencias', controller.buscarEvidenciasDoSuspeito);

module.exports = router;
