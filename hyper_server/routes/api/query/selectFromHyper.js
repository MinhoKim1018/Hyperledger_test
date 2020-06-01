var { queryTxFunc } = require('../../../hyperSync/query/index')
var { logger } = require('../../../common/winston')



exports.selectBlockHeight=async(req,res)=>{

    logger.info('##### get Height Info ##### ')
    var result = await queryTxFunc.queryBlockChain()
    
    logger.info(result+'\n')
    res.send(result)
}

exports.selectBlockInfo=async(req,res)=>{

    logger.info('##### get Block Info by BlockNumber ##### ')
    let blockNum = req.body.blockNum

    var result = await queryTxFunc.queryBlock(blockNum)

    logger.info(result+'\n')
    res.send(result)
}


exports.selectTxInfo = async(req,res)=>{

    logger.info('##### get TX Info by txId ##### ')
    let tx = req.body.tx

    var result = await queryTxFunc.queryTransaction(tx)

    logger.info(result+'\n')
    res.send(result)
}

exports.selectBlockInfoByHash = async(req,res)=>{
    logger.info('##### get Block Info by BlockHash ##### ')
    let blockHash = req.body.blockHash

    var result = await queryTxFunc.queryBlockByHash(blockHash)

    res.send(result)
}