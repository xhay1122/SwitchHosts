/**
 * Created by hai.xiong on 2020/3/27.
 * 简单实现lodash.get
 */

function deepGet(object, path, defaultValue) {
    return (!Array.isArray(path) ? path.replace(/\[/g, '.').replace(/\]/g, '').split('.') : path)
        .reduce((o, k) => (o || {})[k], object) || defaultValue;
}

module.exports = deepGet;
