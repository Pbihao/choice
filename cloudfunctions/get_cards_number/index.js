const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const col = db.collection('questions')
//会返回数据库里一共有多少条记录
exports.main = async(event, context) => col.where({}).count()
