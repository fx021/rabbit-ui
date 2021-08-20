import request from '@/router/axios'

const requestCache = {}
/**
 * 缓存请求结果(数组,非数组的最好不要在此),可保证三秒内不重复请求
 * @param {*同axios} config 
 * @param {*属性名} prop 
 * @param {*前缀} prefix 
 * @returns 同axios request
 */
export default function cacheRequest(config, prop, prefix) {
    return new Promise((resolve, reject) => {
        prop = `${prefix || 'common'}-${prop || '1'}`
        let result = requestCache[prop]
        if (result && result != 1) {
            resolve(result)
            return
        }
        if (result === 1) {//排队中
            const delayCheck = () => {
                result = requestCache[prop]
                // console.log("delayCheck", prop, result)
                if (result && result != 1) {
                    resolve(result)
                } else if (result) {
                    setTimeout(() => {
                        delayCheck()
                    }, 600)
                } else {
                    request(config).then(res => {
                        resolve(res.data.data || [])
                        // console.log("request 2")
                    }).catch(err => {
                        reject(err)
                    })
                }
            }
            setTimeout(delayCheck, 1000);
            return
        }
        requestCache[prop] = 1
        const clearCache = () => {
            setTimeout(() => {
                delete requestCache[prop]
                // console.log("remove cache", prop)
            }, 3200)
        }
        request(config).then(res => {
            let data = res.data.data || []
            // console.log("request end", prop)
            requestCache[prop] = data
            resolve(data)
            clearCache()
        }).catch(err => {
            requestCache[prop] = []
            reject(err)
            clearCache()
        })
    })
}