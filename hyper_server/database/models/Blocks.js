const Sequelize = require('sequelize');
const db = require('../db')

module.exports = db.sequelize.define('hyper_Blocks',{
    index:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    block_num:{
        type:Sequelize.INTEGER,
        unique:true,
        allowNull:false
    },
    block_hash:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },
    previous_hash:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },
    tx_hash:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },
    timestamp:{
        type:Sequelize.DATE,
    },
    timestamp_kst:{
        type:Sequelize.DATE,
    },
    channel_id:{
        type:Sequelize.STRING,
        allowNull:false
    },
    creator:{
        type:Sequelize.STRING,
        allowNull:false
    }
},{
    freezeTableName:true,
}
)