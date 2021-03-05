const router = require('express').Router();

const { indexAdmin } = require('../servicios/adminindex.servicio');
const { isAdmin } = require('../config/auth');

/*
 * GET admin index
*/
router.get('/', isAdmin, indexAdmin);

module.exports = router;