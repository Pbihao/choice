const app = getApp()
const db = wx.cloud.database()
const default_cards = db.collection("default_cards")

export function getDefaultCards (begin){
  data = 0
  default_cards
    .limit(10)
    .get()
    .then(res => {
      console.log(res.data)
      data = res
    })
    .catch(err => {
      conole.log(err)
    })
    return data
}
export function qwe(){
  console.log(123321)
}