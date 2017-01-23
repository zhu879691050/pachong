"use strict"
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
var log = function() {
    console.log.apply(console, arguments)
}
const moviesAll = []
const handle = function(path){
  fs.readFile(path, function(err, data){
    if (err == null) {
      const s = JSON.parse(data)
      // const s = data
      log('---', s.length)
      for (var i = 0; i < s.length; i++) {
          moviesAll.push(s[i])
      }
      log("---moviesAll", moviesAll.length)
      saveMovies(moviesAll)
    } else {
      log(err)
    }

  })
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

const __main = function(){
    const j = 300
    for (var i = 0; i < j; i++) {
      const path = '_' + i + '.txt'
      handle(path)
      log('00000', moviesAll.length)
    }
}

__main()
