var { selectUserFunc, selectTxFunc } = require('../../../hyperSync/query/index')
var { logger } = require('../../../common/winston')


//from chaincode
exports.selectAllUser = async (req, res) => {

    let symbol = req.body.symbol;

    logger.info('selectAllUser from Hyper')
    var result = await selectUserFunc.selectAllUser(symbol);
    logger.info(JSON.parse(result.response) + '\n')
    res.send(JSON.parse(result.response))
}

exports.selectUserTx = async (req, res) => {

    let symbol = req.body.symbol;
    let id = req.body.id

    logger.info('selectUserTx from hyper');
    var result = await selectTxFunc.selectUserTx(symbol, id);
    var parseResult = JSON.parse(result.response)
    // logger.info(JSON.parse(result)+ '\n');
    res.send(parseResult)

}
