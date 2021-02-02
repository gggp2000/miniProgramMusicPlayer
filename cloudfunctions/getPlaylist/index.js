// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'music-player-zgt4m',
  traceUser: true
})

const db = cloud.database()
const pl = db.collection('playlist')
const MAX_LIMIT = 10

const axios = require('axios')
const URL = 'https://apis.imooc.com/personalized?icode=9A774351FF9FA99B'

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    data
  } = await axios.get(URL)
  if (data.code >= 1000) {
    console.log(data.msg)
    return 0
  }
  const playlist = data.result

  // 读取数据集合中全部数据
  const total = (await pl.count()).total
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  let list = {
    data: []
  }

  for (let i = 0; i < batchTimes; i++) {
    tasks.push(pl.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get())
  }
  list = (await Promise.all(tasks)).reduce((acc,cur)=>{
    return {
      data: acc.data.concat(cur.data)
    }
  })
  console.log(list)

  let saveCount = 0
  for (let i = 0; i < playlist.length; i++) {
    const result = await pl.where({
      id: playlist[i].id
    }).count()
    if (result.total == 0) {
      await pl.add({
        data: {
          ...playlist[i],
          createTime: db.serverDate()
        }
      }).then((res) => {
        console.log("写入数据库")
        saveCount++
      }).catch((err) => {
        console.error(err)
      })
    } else {
      console.log("数据重复，未写入")
    }
  }
  return saveCount
}