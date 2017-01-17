"use strict"

const requset = require('request')
const cheerio = require('cheerio')

var log = function() {
    console.log.apply(console, arguments)
}

const Video = function() {
    this.name = ''
    this.view = 0
}


const videosFromDiv = function(div) {
    const video = new Video()
    const e = cheerio.load(div)
    video.name = e('.title').attr('title')
    video.view = e('.v-info-i gk').find("span").attr('number')
    return video
}

const saveVideos = function(videos) {
    const fs = require('fs')
    const path = 'videos.txt'
    const s = JSON.stringify(videos, null, 2)
    fs.writeFile(path, s, function(error){
      if (error !== null) {
        log('!!*_*!! 写入文件错误', error)
      } else {
        log("*** 保存成功")
      }
    })
}



const videos = []
const videosFromUrl = function(url) {
    request(url, function(error, response, body){
        if(error == null && response.statusCode == 200) {
          const e = cheerio.load(body)
          const videoDivs = e('.l-item')
          for(let i = 0; i < videoDivs.length; i++) {
            let element = videoDivs[i]
            const div = e(element).html()
            const v = videosFromDiv(div)
            videos.push(v)
          }
          log('videos', videos.length)
        }else {
          log('!!*_*!!  请求失败',error)
        }
    })
}



const __main = function(){
      var i = 1
  const eat = function(){
    var path = 'http://www.bilibili.com/video/tech-popular-science-1.html#!page='
    var url = path + i +'8&tagid=6942&tag=%E5%90%83%E8%B4%A7'
    videosFromUrl(url)
    log('videos.length', videos.length)
    if(videos.length == i * 20){
      if (videos.length >= 560) {
        saveVideos(video)
        return
      } else {
        i = i + 1
        setTimeout(eat, 2000)
      }
    } else {
      log('!!videos爬虫失败！！')
    }
  }
  eat()
}
__main()
