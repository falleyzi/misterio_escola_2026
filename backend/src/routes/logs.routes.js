// src/routes/logs.routes.js
const router = require('express').Router();
const controller = require('../controllers/logs.controller');

router.get('/predio', controller.listarLogsPredio);
router.get('/servidor', controller.listarLogsServidor);

module.exports = router;
