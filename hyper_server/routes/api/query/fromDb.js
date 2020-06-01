var {transactionRouter,blockRouter} = require('../../../database/query/index')
var {logger} = require('../../../common/winston')


exports.pagingTx=async (req,res)=>{

    logger.info("###### start Tx paging ######"+req.body.pageNum)

    var pageData = await transactionRouter.pagingTransaction(req.body.pageNum)
    res.send(pageData)
}


exports.pagingBlock=async (req,res)=>{

    logger.info("###### start Block paging ######"+req.body.pageNum)

    var pageData = await blockRouter.pagingBlock(req.body.pageNum)
    res.send(pageData)
}

exports.selectTodayTx=async(req,res)=>{
    logger.info("###### start Today Tx ######")
    var todayTx =await transactionRouter.selectTodayTx()

    console.log(todayTx)

    res.send(todayTx)

}

exports.selectdaysInfo=async(req,res)=>{
    logger.info("###### start 8days Tx ######")
    
    var dayInfo = await transactionRouter.selectdaysInfo()

    res.send(dayInfo)

}

