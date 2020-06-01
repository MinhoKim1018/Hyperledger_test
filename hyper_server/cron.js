var express = require("express");
var router = express.Router();

var axios = require('axios')
var cron = require("node-cron");

var { logger } = require('./common/winston')

var {blockRouter,transactionRouter} = require('./database/query/index')
// var { selectBlock, insertBlock } = require('./database/query/block_query')
// var { selectTransaction, insertTransaction } = require('./database/query/transaction_query')
var { queryTxFunc } = require('./hyperSync/query/index')

cron.schedule("* * * * *", async () => {
  try {

    logger.info("############# crontab START ##################")

    var lastBlockFromDB = await blockRouter.selectBlock()

    var blockHeight = await queryTxFunc.queryBlockChain()

    logger.info('Current Block Height : ' + blockHeight.height)

    if (lastBlockFromDB < blockHeight.height) {
      for (var i = lastBlockFromDB; i < blockHeight.height; i++) {

        var blockInfo = await queryTxFunc.queryBlock(i)

        logger.info(JSON.stringify(blockInfo))

        if (blockInfo) {

          var blockInsertResult = await blockRouter.insertBlock(
            blockInfo.block_num,
            blockInfo.data_hash,
            blockInfo.previous_hash,
            blockInfo.tx_id,
            blockInfo.timestamp,
            blockInfo.channel_id,
            blockInfo.creator
          )
          if (blockInsertResult.code == 1 && blockInfo.action[0]) {
            var selectTxResult = await queryTxFunc.queryTransaction(blockInfo.tx_id)
            if (selectTxResult.action[1]) {
              logger.info(selectTxResult.action[1].value)
              var value = JSON.parse(selectTxResult.action[1].value)
              await transactionRouter.insertTransaction(value.tx_id,selectTxResult.action[1].key,value.merchant,value.symbol,value.quantity,selectTxResult.timestamp,selectTxResult.channel_id,selectTxResult.creator)
            }
            else {
              logger.info(selectTxResult.action[0].value)
              var value = JSON.parse(selectTxResult.action[0].value)
              await transactionRouter.insertTransaction(value.tx_id,selectTxResult.action[0].key,value.merchant,value.symbol,value.quantity,selectTxResult.timestamp,selectTxResult.channel_id,selectTxResult.creator)
            }
          }


        }
      }
    }

    logger.info("############# crontab END ################## \n")

  }
  catch (err) {
    logger.error(err)
  }

});


module.exports = router;
