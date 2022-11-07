const fs = require('fs')
const path = require('path')
const go = require('./go')

var source = fs.readFileSync(path.join(__dirname, './index.m3u8'), 'utf-8')
var arr = (source.split('\n')).filter(item => {
    return item.match(/.ts$/)
})
var host = 'https://cdn123456789.51551.cn:4433/73sm/asmr/1661829410/'
var outputName = 'output.mp4'
go({
    arr,
    host,
    outputName
})