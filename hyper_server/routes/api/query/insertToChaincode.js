var { insertFunc } = require('../../../hyperSync/query/index')

var { logger } = require('../../../common/winston')

exports.insertUserTx = async (req, res) => {

    logger.info('insertUserTx To Hyper')

    let id = req.body.id
    let merchant = req.body.merchant
    let quantity = req.body.quantity
    let user_id = req.body.user_id
    let symbol =req.body.symbol

    console.log(req.body)
    var result = await insertFunc.insertUserTx(id, merchant, symbol, quantity, user_id)

    res.send(result)
}