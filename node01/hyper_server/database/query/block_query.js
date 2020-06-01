const blockModel = require('../models/Blocks')
var sequelize = require('sequelize')

var { logger } = require('../../common/winston')
var moment = require('moment-timezone')


exports.selectBlock = async()=>{
    
    let lastBlock=1

    await blockModel.max('block_num')
    .then(max=>{
        if(max)
           lastBlock=max+1
        else
           lastBlock
    })
    return parseInt(lastBlock)
}


exports.insertBlock = async (blockNum,blockHash,previousHash,txHash,timestamp,channelId,creator)=>{
    logger.info("#####START INSERT BLOCK#####")
  
      let result;

    if(blockNum&&
       blockHash&&
       previousHash&&
       txHash&&
       timestamp&&
       channelId&&
       creator){

         var kst =await moment(timestamp)
         
        await blockModel.create({block_num:blockNum,
                           block_hash:blockHash,
                           previous_hash:previousHash,
                           tx_hash:txHash,
                           timestamp:timestamp,
                           timestamp_kst:kst.tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
                           channel_id:channelId,
                           creator:creator
                        }).then(res=>{
                           if(res.dataValues){
                              logger.info("insert Block Successed")
                              result= {code:1,message:"Successed"}
                           }
                           else{
                              logger.info("insert Block Failed")
                              result= {code:2,message:"Failed"}
                           }

                        })

       }
    logger.info("#####END INSERT BLOCK######\n")

    return result;

}

exports.pagingBlock= async (pageNum)=>{

   logger.info("##### Start select paging Tx ######")

   var totaltx;
   var pageArr;
   var offset;

   if(pageNum>1){
       offset = 10*(pageNum-1)
   }

   await blockModel.count()
   .then(res=>{
       totaltx=res
   })

   await blockModel.findAll({
       offset:offset,
       limit:10,
       order:[['timestamp','desc']]
   }).then(res=>{
       pageArr =res
   })
   
   return {totaltx:totaltx,pageArr:pageArr}

}