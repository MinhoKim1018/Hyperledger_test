const router = require('express').Router();

var insertToChaincode = require('./insertToChaincode')
var selectFromChaincode = require('./selectFromChaincode')
var selectFromHyper = require('./selectFromHyper')
var fromDb = require('./fromDb')

router.post('/insertUserTx', insertToChaincode.insertUserTx);
router.post('/selectAllUser', selectFromChaincode.selectAllUser);
router.post('/selectUserTx', selectFromChaincode.selectUserTx);

router.post('/getBlockHeight',selectFromHyper.selectBlockHeight)
router.post('/getBlockInfo',selectFromHyper.selectBlockInfo)
router.post('/getTransaction', selectFromHyper.selectTxInfo);
router.post('/selectBlockInfoByHash', selectFromHyper.selectBlockInfoByHash);


router.post('/pagingTx',fromDb.pagingTx);
router.post('/pagingBlock',fromDb.pagingBlock);
router.post('/selectTodayTx',fromDb.selectTodayTx);
router.post('/selectdaysInfo',fromDb.selectdaysInfo);


module.exports = router;