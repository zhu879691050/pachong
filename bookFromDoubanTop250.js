"use strict"

const request = require('request')
const cheerio = require('cheerio')
var log = function() {
    console.log.apply(console, arguments)
}

var e = function(s) {
    return document.querySelector(s)
}

var es = function(s) {
    return document.querySelectorAll(s)
}

const Book = function() {
    this.name = ''
    this.score = 0
}

const booksFromDiv = function(div) {
    const book = new Book()
    const e = cheerio.load(div)
    book.name = e('.pl2 a').attr('title')
    book.score = e('.rating_nums').text()
    return book
}

const saveBooks = function(book) {
    const fs = require('fs')
    const path = 'book.txt'
    const s = JSON.stringify(book, null, 2)
    fs.writeFile(path, s, function(error){
      if (error !== null) {
        log('!!*_*!! 写入文件错误', error)
      } else {
        log("*** 保存成功")
      }
    })
}

const books = []
const booksFromUrl = function(url) {
    request(url, function(error, response, body){
        if(error == null && response.statusCode == 200) {
          const e = cheerio.load(body)
          const bookDivs = e('.item')
          for(let i = 0; i < bookDivs.length; i++) {
            let element = bookDivs[i]
            const div = e(element).html()
            const b = booksFromDiv(div)
            books.push(b)
          }
          log('book', books.length)
        }else {
          log('!!*_*!!  请求失败',error)
        }
    })
}
const __main = function(){
      var i = 0
  const douban = function(){
    var url = 'https://book.douban.com/top250?start='+ (i * 25) + '&filter='
    booksFromUrl(url)
    log('books.length', books.length)
    if(books.length == i * 25){
      if (books.length >= 250) {
        saveBooks(books)
        return
      } else {
        i = i + 1
        setTimeout(douban, 2000)
      }
    } else {
      log('!!douban爬虫失败！！')
    }
  }
  douban()
}
__main()
