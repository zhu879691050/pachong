"use strict"
const request = require('request')
const cheerio = require('cheerio')
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

const movieFromUrl = function(url) {
  request(url, function(error, response, body){
    if (error === null && response.statusCode == 200) {
      const movies = []
      const e = cheerio.load(body)
      const moviesDiv = e('.item')
      for (var i = 0; i < moviesDiv.length; i++) {
        const div = moviesDiv[i]
        const m = movieFromDiv(div)
        movies.push(m)
      }
      saveMovies(movies)
      log('页面载入成功', movies.length)
    } else {
      log('**** 请求失败', error)
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
const __main = function() {
    const url = 'https://movie.douban.com/tag/%E5%8A%A8%E7%94%BB?start=0&type=T'
    movieFromUrl(url)
}

__main()
