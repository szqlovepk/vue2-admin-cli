// 请求 log-symbols 库
const symbols = require('log-symbols')
// 请求 fs-extra 库
const fse = require('fs-extra')

const path = require('path')

// 请求 config.js 文件
const defConfig = require('./config')
// 拼接 config.json 完整路径
const cfgPath = path.resolve(__dirname, '../config.json')

async function setMirror(link) {
  // 判断 config.json 文件是否存在
  const exists = await fse.pathExists(cfgPath)
  if (exists) {
    // 存在时直接写入配置
    mirrorAction(link)
  } else {
    // 不存在时先初始化配置，然后再写入配置
    await defConfig()
    mirrorAction(link)
  }
}

async function mirrorAction(link) {
  try {
    // 读取 config.json 文件
    const jsonConfig = await fse.readJson(cfgPath)
    // 将传进来的参数 link 写入 config.json 文件
    jsonConfig.mirror = link
    // 再写入 config.json 文件
    await fse.writeJson(cfgPath, jsonConfig)
    // 等待写入后再提示配置成功
    console.log(symbols.success, 'Set the mirror successful.')
  } catch (err) {
    // 如果出错，提示报错信息
    console.log(symbols.error, chalk.red(`Set the mirror failed. ${err}`))
    process.exit()
  }
}

// 将上面的 setMirror(link) 方法导出
module.exports = setMirror