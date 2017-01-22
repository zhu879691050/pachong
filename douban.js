"use strict"
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

var log = function() {
    console.log.apply(console, arguments)
}



const Movie = function() {
    this.name = ''
    this.score = 0
    this.date = 0
    this.url = ''
}

const movieFromDiv = function(div) {
    const movie = new Movie()
    const e = cheerio.load(div)
    movie.name = e(".nbg").attr('title')
    movie.score = e('.rating_nums').text()
    movie.date = e('.pl').text().slice(0, 10)
    movie.url = e(".nbg").attr('href')
    return movie
}

const moviesFromBody = function(body) {
    const options = {
        decodeEntities: false,
    }
    const movies = []
    const e = cheerio.load(body)
    const moviesDiv = e('.item')
    for (var i = 0; i < moviesDiv.length; i++) {
      let ele = moviesDiv[i]
      const div = e(ele).html()
      const m = movieFromDiv(div)
      movies.push(m)
    }
    log('---movies')
    return movies
}

const saveMovies = function(movies) {
    const fs = require('fs')
    const path = '动画.txt'
    const data = JSON.stringify(movies, null, 2)
    fs.writeFile(path, data, function(error){
        if (error !== null) {
          log('****写入文档失败', error)
        } else {
          log('----写入成功')
        }
    })
}

const writeToFile = function(path, data) {
    fs.writeFile(path, data, function(error) {
      if (error != null) {
          log('--- 写入成功', path)
      } else {
          log('*** 写入失败', path)
      }
    })
}
const catchedUrl = function(options, callback) {
    //这个 qqqq 用于下载数据失败时的停止条件
    const qqqq = 1
    const path = options.url.split('/').join('-').split(':').join('-')
    fs.readFile(path, function(err, data){
        if(err !== null) {
            request(options, function(error, response, body) {
              if (response.statusCode == 200 && response != null) {
                writeToFile(path, body)
                callback(error, response, body)
              } else {
                if(qqqq < 5){
                  log("****下载数据失败,重新下载" + qqqq)
                  catchedUrl(options, callback)
                }
                log('-****-下载失败')
              }
            })
        } else {
          log('读取到缓存的页面', path)
          const response = {
              statusCode: 200,
          }
          callback(null, response, data)
        }
    })

}

const douban__main = function(url, path) {
    const cookie = 'bid=LrEymjL9VpY; gr_user_id=c06b91ab-df2d-4e43-8033-eb5b26f6da0d; ll="118172"; dbcl2="156588413:Dq0Iv87OUQs"; ps=y; ck=nxLR; ct=y; _vwo_uuid_v2=EA856747F10C6DC7B02906EDEAA9CA35|44bcfa70d91406117c80c57c5cda6cc7; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1485094801%2C%22https%3A%2F%2Fwww.baidu.com%2Fs%3Fie%3Dutf-8%26f%3D8%26rsv_bp%3D1%26rsv_idx%3D1%26tn%3Dbaidu%26wd%3D%25E8%25B1%2586%25E7%2593%25A3%26oq%3Dweb%2520design%26rsv_pq%3Dd162023d000024df%26rsv_t%3D14aeOKfIZAsgYDBJro7GNIuBpsFdQuB%252Bg9HtYXujfqtyAmtfF0cN%252FGIOF8w%26rqlang%3Dcn%26rsv_enter%3D1%26rsv_sug3%3D14%26rsv_sug1%3D9%26rsv_sug7%3D100%26bs%3Dweb%2520design%22%5D; push_noty_num=0; push_doumail_num=0; _pk_id.100001.4cf6=e6a3a93c4e917a85.1484405841.6.1485094833.1485092004.; __utma=30149280.2115784304.1484406587.1485091969.1485094801.9; __utmc=30149280; __utmz=30149280.1484744188.5.3.utmcsr=accounts.douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/register_success; __utmv=30149280.15658; __utma=223695111.1088499812.1484573996.1485091969.1485094801.5; __utmc=223695111; __utmz=223695111.1484573996.1.1.utmcsr=baidu|utmccn=(organic)|utmcmd=organic|utmctr=%E8%B1%86%E7%93%A3; ap=1'
    const useragent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36"
    const headers = {
        'Cookie': cookie,
        'User-Agent': useragent,
    }
    const options = {
        url: url,
        headers: headers,
    }
    catchedUrl(options, function(error, response, body){
        // 回调函数的三个参数分别是  错误, 响应, 响应数据
        // 检查请求是否成功, statusCode 200 是成功的代码
        if (error === null && response.statusCode == 200) {
            const answers = moviesFromBody(body)
            // 引入自己写的模块文件
            // ./ 表示当前目录
            const utils = require('./utils')
            utils.saveJSON(path, answers)
        } else {
            log('*** ERROR 请求失败 ', error)
        }
    })
}

const __main = function() {
    const end = 3000 / 20 + 1
    for (var i = 101; i < end; i++) {
      const url = 'https://movie.douban.com/tag/%E5%8A%A8%E7%94%BB?start=' + i * 20 + '&type=T'
      const path ='_' + i + '.txt'
      douban__main(url, path)
    }
}
__main()
