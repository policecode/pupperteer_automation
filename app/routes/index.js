var express = require('express');
var router = express.Router();

// router.use('/items', require('./items'));
router.use('/gmail', require('./gmail'));
router.use('/facebook', require('./facebook'));


module.exports = router;