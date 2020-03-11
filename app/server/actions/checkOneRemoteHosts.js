/**
 * @author oldj
 * @blog https://oldj.net
 */

'use strict'

const lodashGet = require('lodash/get');
const getUrl = require('./getUrl')
const isExpired = require('../checkIsExpired')
const lineBreakTransform = require('../../libs/lineBreakTransform')
const moment = require('moment')

function now () {
  return moment().format('YYYY-MM-DD HH:mm:ss')
}

function fixContent(json, dataPath) {
  if(!dataPath) {
    return json;
  }
  try {
    const obj = JSON.parse(json);
    const content = lodashGet(obj, dataPath);
    if (Array.isArray(content)) {
      // 结果是数组 使用join方法变成字符串
      return content.join('\n');
    } else if (typeof content === "string") {
      // 结果是字符串 直接返回
      return content;
    } else {
      // 不支持转换
      return json;
    }
  } catch (e) {
    return json;
  }
}

module.exports = (svr, hosts, force = false) => {
  return new Promise((resolve, reject) => {
    if (hosts.where !== 'remote' || !hosts.url) {
      resolve(hosts)
      return
    }

    if (force || isExpired(svr, hosts)) {
      let hosts2 = Object.assign({}, hosts)

      console.log('checkRemote', `'${hosts2.title}'`, force, isExpired(svr, hosts2))
      getUrl(svr, hosts2.url)
        .then(content => {
          hosts2.content = lineBreakTransform(fixContent(content, hosts2.data_path) || '')
          hosts2.last_refresh = now()
        })
        .then(() => resolve(hosts2))
        .catch(e => {
          console.log(e)
          reject(e)
        })
    } else {
      resolve(hosts)
    }
  })
}
