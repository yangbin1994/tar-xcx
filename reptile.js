let cheerio = require('cheerio')
let request = require('request')
let reptileTargetUrl = 'http://lol.duowan.com/hero/'
let fs = require('fs')
let path = require('path')

request(reptileTargetUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        let $ = cheerio.load(body)
        let $heros = $('.tooltip.champion_tooltip')
        let heroArr = []
        $heros.each(function (idx, item) {
            var $item = $(item);
            var hero = {
                imgUrl: $item.find('img').prop('src'),
                name: $item.find('h2').text(),
                alias: $item.find('h3').text(),
                introduce: $item.find('p').text()
            }
            heroArr.push(hero)
        })
        
        fs.writeFile(path.join('src', 'data', 'heros.txt'),
            JSON.stringify(heroArr), function(){})
    }
})