// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database()
cloud.init()
const _=db.command
const col=db.collection("questions")
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await col.doc(event.id).update({
      data: {
        comment_number: _.inc(1),
        comment: _.push(event.comment)
      }
    })
  } catch (e) {
    console.error(e)
  }
}