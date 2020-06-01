
const router = require('express').Router();
var adminRouter = require('./admin');

var queryRouter = require('./query')

router.use('/admin', adminRouter);
router.use('/query', queryRouter);


module.exports = router;
