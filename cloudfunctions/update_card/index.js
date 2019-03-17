// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database()
const _ = db.command

//会传入四个参数
//id openid left right 
exports.main = async (event, context) => {
  const col =cloud.database().collection('questions')
  try{
    return await col.doc(event.id).update({
      data: {
        left: _.inc(event.left),
        right: _.inc(event.right),
        used: _.push(event.openid)
      } 
    })
  }catch(e){
    console.error(e)
  }
}