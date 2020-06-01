const TransactionModel = require('../models/Transactions')
var Sequelize = require('sequelize')

var { logger } = require('../../common/winston')
var moment = require('moment-timezone')

const Op = Sequelize.Op
exports.selectTransaction = async () => {

    let lastTx = 1

    await TransactionModel.max('block_num')
        .then(max => {
            if (max)
                lastTx = max + 1
            else
                lastTx
        })
    return parseInt(lastTx)
}

exports.insertTransaction = async (tx_hash, key, merchant, symbol, quantity, timestamp, channelId, creator) => {
    logger.info("#####START INSERT TRANSACTION#####")

    console.log(tx_hash, key, merchant, symbol, quantity, timestamp, channelId, creator)

    if (tx_hash &&
        key &&
        merchant &&
        symbol &&
        quantity &&
        timestamp &&
        channelId &&
        creator) {

        var kst = await moment(timestamp)

        TransactionModel.create({
            tx_hash: tx_hash,
            key: key,
            merchant: merchant,
            symbol: symbol,
            quantity: quantity,
            timestamp: timestamp,
            timestamp_kst: kst.tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
            channel_id: channelId,
            creator: creator
        }).then(res => {
            if (res.dataValues)
                logger.info("insert Tx Successed")
            else
                logger.info("insert Tx Failed")

        })

    }
    logger.info("#####END INSERT TRANSACTION######\n")

}

exports.pagingTransaction = async (pageNum) => {

    logger.info("##### Start select paging Tx ######")

    var totaltx;
    var pageArr;
    var offset;

    if (pageNum > 1) {
        offset = 10 * (pageNum - 1)
    }

    await TransactionModel.count()
        .then(res => {
            totaltx = res
        })

    await TransactionModel.findAll({
        offset: offset,
        limit: 10,
        order: [['timestamp', 'desc']]
    }).then(res => {
        pageArr = res
    })

    return { totaltx: totaltx, pageArr: pageArr }

}

exports.selectTodayTx = async () => {

    var date = await new Date()
    var kst = await moment(date)
    var timestamp = kst.tz('Asia/Seoul').format('YYYY-MM-DD')
    
    var todayTx

    await TransactionModel.count({
        where: {
            timestamp_kst: { [Op.gt]: timestamp }
        }
    })
        .then(res => {
            console.log(res)
            todayTx = res
        })

    return { todayDate: timestamp, todayTx: todayTx }
}

async function dateCal(num) {

    var oioi = await moment().subtract(num, 'd')
    return oioi.tz('Asia/Seoul').format('YYYY-MM-DD')
}

exports.selectdaysInfo = async () => {

    var todayTx

    var startDate1 = moment().subtract(7, 'd')
    var endDate1 = moment().add(1, 'd')


    var startDate = startDate1.format('YYYY-MM-DD')
    var endDate = endDate1.format('YYYY-MM-DD')


    // var one =0, two = 0, three = 0, four = 0, five = 0, six = 0, seven = 0, eight = 0
    // var quantityOne = 0, quantityTwo = 0, quantityThree = 0, quantityFour = 0, quantityFive = 0, quantitySix = 0, quantitySeven = 0, quantityEight = 0

    var one = { date: await dateCal(7), count: 0, quantity: 0 }, two = { date: await dateCal(6), count: 0, quantity: 0 }, three = { date: await dateCal(5), count: 0, quantity: 0 }, four = { date: await dateCal(4), count: 0, quantity: 0 }, five = { date: await dateCal(3), count: 0, quantity: 0 }, six = { date: await dateCal(2), count: 0, quantity: 0 }, seven = { date: await dateCal(1), count: 0, quantity: 0 }, eight = { date: await dateCal(0), count: 0, quantity: 0 }

    await TransactionModel.findAll({
        where: {
            timestamp_kst: { [Op.gt]: startDate, [Op.lt]: endDate }
        }
    }).then(async res => {
        todayTx = res

        for (var i = 0; i < todayTx.length; i++) {
            let temporaryData =moment(todayTx[i].timestamp_kst).format('YYYY-MM-DD')
            let temporaryQuantity = todayTx[i].quantity


            if (moment().diff(temporaryData, 'days') == 7) {
                // one = one + 1
                // quantityOne = quantityOne + temporaryQuantity
                one.count = one.count + 1
                one.quantity = one.quantity + temporaryQuantity
            }
            else if (moment().diff(temporaryData, 'days') == 6) {
                // two = two + 1
                // quantityTwo = quantityTwo + temporaryQuantity
                two.count = two.count + 1
                two.quantity = two.quantity + temporaryQuantity
            }
            else if (moment().diff(temporaryData, 'days') == 5) {
                // three = three + 1
                // quantityThree = quantityThree + temporaryQuantity
                three.count = three.count + 1
                three.quantity = three.quantity + temporaryQuantity
            }
            else if (moment().diff(temporaryData, 'days') == 4) {
                // four = four + 1
                // quantityFour = quantityFour + temporaryQuantity
                four.count = four.count + 1
                four.quantity = four.quantity + temporaryQuantity
            }
            else if (moment().diff(temporaryData, 'days') == 3) {
                // five = five + 1
                // quantityFive = quantityFive + temporaryQuantity
                five.count = five.count + 1
                five.quantity = five.quantity + temporaryQuantity
            }
            else if (moment().diff(temporaryData, 'days') == 2) {
                // six = six + 1
                // quantitySix = quantitySix + temporaryQuantity
                six.count = six.count + 1
                six.quantity = six.quantity + temporaryQuantity
            }
            else if (moment().diff(temporaryData, 'days') == 1) {
                // seven = seven + 1
                // quantitySeven = quantitySeven + temporaryQuantity
                seven.count = seven.count + 1
                seven.quantity = seven.quantity + temporaryQuantity
            }
            else if (moment().diff(temporaryData, 'days') == 0) {
                // eight = eight + 1
                // quantityEight = quantityEight + temporaryQuantity
                eight.count = eight.count + 1
                eight.quantity = eight.quantity + temporaryQuantity
            }

        }
    })

    return {
        one, two, three, four, five, six, seven, eight
    }
}