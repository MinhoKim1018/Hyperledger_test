/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class UserTxH3C extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('############initing##############')
        console.info('============= END : Initialize Ledger ===========');
    }

    
    async insertUserTx(ctx,i,user_id,tx_id,merchant,symbol,quantity) {

        var num_size = 6-i.length
        var resultNum = i

        if(0<num_size){
            for(var i=1;i<num_size;i++){
                resultNum=0+resultNum
            }
        }

        const startKey = "USER_"+resultNum+"_0"
        const endKey = "USER_"+resultNum+"_99999"

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];

        

        while (true) {
            
            const res = await iterator.next();
       
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                await allResults.push({ Key, Record });
                console.log("Reuslt Length :::: ",allResults.length)   
                
            }

            if(allResults.length==0){
                console.log("@@@@@@@@@@@@@@@@@@@@@@@allResult putstate",allResults.length)
                
                await ctx.stub.putState('USER'+resultNum,Buffer.from(JSON.stringify({init:user_id})))
                
                console.log("@@@@@@@@@@@@@@@@@@@@@@@allResult putstate ###########END#############")
            }
           
            if (res.done) {

                const allResultsLength=allResults.length

                console.log("resultNum : " + resultNum)
                console.log("resultLength : " + allResultsLength)

                console.log('res done !!! ##### put state tx info');
                await iterator.close();
                var infoJson={tx_id:tx_id,merchant:merchant,symbol:symbol,quantity:quantity}
                await ctx.stub.putState('USER_'+resultNum+'_'+allResultsLength,Buffer.from(JSON.stringify(infoJson)) );
                console.info('============= END : insert Data ===========');
                return ;
                
            }
        }        
    }


    async queryUserAllTx(ctx,i) {
        
        var num_size = 6-i.length
        var resultNum = i

        if(0<num_size){
            for(var i=1;i<num_size;i++){
                resultNum=0+resultNum
            }
        }

        console.log(resultNum)

        const startKey = "USER_"+resultNum+"_0"
        const endKey = "USER_"+resultNum+"_99999"
        
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = res.value.value.toString('utf8')
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data (query User All TX)');
                await iterator.close();
                console.info(allResults);
                
                return allResults;
            }
        }        
    }


    async queryAllUser(ctx) {
        
        const startKey = "USER0"
        const endKey = "USER99999"

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = res.value.value.toString('utf8')
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data (query All User)');
                await iterator.close();
                console.info(allResults);
                
                return allResults;
            }
        }        
    }
}

module.exports = UserTxH3C;
