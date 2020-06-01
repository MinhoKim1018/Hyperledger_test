const router = require('express').Router();
var selectTxRouter = require('./selectUserTx');
var insertRouter = require('./insertUserTx')
var selectUserRouter = require('./selectAllUser')
var queryTxRouter = require('./queryTxId')
 

router.post('/selectUserTx', selectTxRouter.selectUserTx);

router.post('/insertUserTx', insertRouter.insertUserTx);

router.post('/selectAllUser', selectUserRouter.selectAllUser);

router.post('/queryBlock',queryTxRouter.queryBlock);

router.post('/queryBlockInfo',queryTxRouter.queryTxId);


module.exports = router;