// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'music-player-zgt4m'
})

const TcbRouter = require('tcb-router')
const axios = require('axios')
const BASE_URL = 'https://apis.imooc.com'
const ICODE = 'icode=9A774351FF9FA99B'

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  app.router('playlist', async (ctx, next) => {
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy("createTime", "desc")
      .get()
      .then((res) => {
        return res
      })
  })
  app.router('musiclist', async(ctx, next)=>{
    const res = await axios.get(`${BASE_URL}/playlist/detail?id=${parseInt(event.playlistid)}&${ICODE}`)
    ctx.body = res.data
  })

  app.router('track', async(ctx, next)=>{
    const res = await axios.get(`${BASE_URL}/song/url?id=${parseInt(event.musicid)}&${ICODE}`)
    ctx.body = res.data
  })

  app.router('lyric', async(ctx, next)=>{
    const res = await axios.get(`${BASE_URL}/lyric?id=${parseInt(event.musicid)}&${ICODE}`)
    ctx.body = res.data
  })
  return app.serve()
}