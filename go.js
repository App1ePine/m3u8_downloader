const fs = require('fs')
const path = require('path')
const request = require('request')
const child_process = require('child_process')
const fsextra = require('fs-extra')

module.exports = (obj) => {
    // app 传参进来的 m3u8 文件信息
    obj = obj || {}
    // ts 文件名数组
    var arr = obj.arr || []
    // ts 文件网址
    var host = obj.host || ''
    // 保存后文件名
    var outputName = obj.outputName || `output-${(new Date()).getTime()}.mp4`

    // ts 文件保存文件夹
    const tsDir = path.join(__dirname, `./sources/${arr[0].split('.')[0]}`)
    // 创建 ts 文件目录
    createDir(tsDir)
    console.log('本次 m3u8 资源存放目录为：', tsDir)
    // mp4 文件输出目录
    const resultDir = path.join(__dirname, './results')
    // 创建 mp4 文件目录
    createDir(resultDir)
    // mp4 文件地址
    const resultFilePath = path.join(resultDir, outputName)
    // ffmpeg input file content arr
    var inputTxt = []

    // 下载 ts 文件
    load()
    function load() {
        // 判断是否下载完成，非则从数组前端取出一个进行下载
        if (arr.length > 0) {
            let item = arr.shift()
            let tsUrl = host + item
            console.log('正在下载：---', tsUrl)
            download(tsUrl)
        } else {
            // 下载完成
            console.log('下载 ts 文件完成！--- 开始生成 ffmpeg inputTxt 配置')
            inputTxt.unshift('ffconcat version 1.0')
            try {
                fs.writeFileSync(path.join(tsDir, './input.txt'), inputTxt.join('\n'), undefined, 'utf-8')
            } catch (e) {
                return console.log('写入 ffmpeg 配置失败！---', e)
            }
            // 开始根据配置合成 ts 文件
            console.log('开始合成 ts 文件为 mp4 文件！')
            child_process.exec(`cd ${tsDir} && ffmpeg -i ./input.txt -acodec copy -vcodec copy -absf aac_adtstoasc ${resultFilePath}`, (err, stdout, stderr) => {
                if (err) {
                    return console.log('合成 ts 文件失败！---', err)
                } else {
                    console.log('合成 ts 文件成功！', stdout)
                    // 删除 ts 文件目录
                    fsextra.remove(tsDir, err => {
                        if (err) return console.log('删除 ts 目录失败！---', err)
                        console.log('删除 ts 目录成功！')
                    })
                }
            })
        }
    }
    function download(url) {
        var urlParsed = path.parse(url)
        var filename = urlParsed['name'] + urlParsed['ext']
        var savePath = path.join(tsDir, filename)

        // 插入 ffmpeg 配置文件
        inputTxt.push(`file ${filename}`)
        request({
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                load()
            } else {
                return console.log('下载 ts 文件失败！---', err)
            }
        }).pipe(fs.createWriteStream(savePath))
    }
    function makeDir(dirPath) {
        if (!fs.existsSync(path.dirname(dirPath))) {
            makeDir(path.dirname(dirPath))
        }
        fs.mkdirSync(dirPath)
    }
    function createDir(filePath) {
        if (fs.existsSync(filePath) === false) makeDir(filePath)
    }
}