const router = require('express').Router();
var enrollAdminRouter = require('./enrollAdminRouter');


router.get('/', enrollAdminRouter.admin);

module.exports = router;