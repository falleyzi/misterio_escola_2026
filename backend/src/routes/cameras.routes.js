// src/routes/cameras.routes.js
const router = require('express').Router();
const controller = require('../controllers/cameras.controller');

router.get('/', controller.listarTodas);
router.get('/:id/registros', controller.listarRegistros);

module.exports = router;
