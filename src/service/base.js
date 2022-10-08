import axios from 'axios'

const ERR_OK = 0
const baseURL = process.env.NODE_ENV === 'production' ? 'http://ustbhuangyi.com/music-next/' : '/'

axios.defaults.baseURL = baseURL
/**
 * https://www.jianshu.com/p/5ab5d69d544a
 * 詭異方法解決 sockjs-node/info?t=****
 */
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
export function get(url, params) {
  return axios.get(url, {
    params
  }).then((res) => {
    const serverData = res.data
    if (serverData.code === ERR_OK) {
      return serverData.result
    }
  }).catch((e) => {
    console.log(e)
  })
}
