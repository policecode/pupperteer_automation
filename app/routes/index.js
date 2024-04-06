var express = require('express');
var router = express.Router();

// router.use('/items', require('./items'));

router.use('/gmail', require('./gmail'));
router.use('/facebook', require('./facebook'));
router.use('/truyen-full-super', require('./crawtruyenfull'));
router.use('/truyenfull', require('./truyenfull'));
router.use('/xuatnhapcanh', require('./xuatnhapcanh'));

// router.use('/truyenfull', require('./truyenfull'));
module.exports = router;