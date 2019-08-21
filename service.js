let Parser = require('rss-parser');
let parser = new Parser();
var Crawler = require("crawler");
var HTMLParser = require('node-html-parser');
const cheerio= require('cheerio');
const defaultImageUrl = 'DEFAULT';
const stripHtml = require("string-strip-html");
const sources= [{
   lang:'FR',
    categorie:'SPORT',
   link:'https://www.elwatan.com/category/edition/sports'
}];

class NewsService {

    init(sources) {
        return sources.map(source=> {
            return parser.parseURL(source.link)
        });
    }

    /*
    1. uniform categories
        a. creating categories object (+ returning function)
        b. separate links / category
    2. merging articles
    3.shuffle
    4. limit number of articles ...-> ?min=5&max=10

     */

    getElWatanNews() {
        return new Promise((resolve,reject)=> {
            var c = new Crawler({
                maxConnections: 10,
                // This will be called for each crawled page
                callback: function (error, res, done) {
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        let $ = res.$;
                        // $ is Cheerio by default
                        //a lean implementation of core jQuery designed specifically for the server
                        let posts = HTMLParser.parse($(".posts").html());
                        let articles = posts.querySelectorAll('article');
                        let data = [];
                        let promises = [];
                        articles.forEach(article=> {
                            let $$ = cheerio.load(article.toString(), {decodeEntities: false});
                            let imageUrl = $$('img').attr('data-cfsrc');
                            let title = $$('h3>a').html();
                            let description = $$('p').html();
                            let link = $$('h3>a').attr('href');
                            let date = $$('.date').text();
                            let category = $$('.category span').html();
                            data.push({
                                imageUrl: imageUrl ? imageUrl : defaultImageUrl,
                                title: title,
                                description: description,
                                link: link,
                                date: date,
                                category: category,
                                lang: 'FR',
                                source: 'El Watan'

                            });
                            promises.push(
                                new Promise((resolve, reject) => {
                                    var c2 = new Crawler({
                                        maxConnections: 10,
                                        // This will be called for each crawled page
                                        callback: function (error, res, done) {
                                            if (error) {
                                                reject(error);
                                            } else {
                                                let $ = res.$;
                                                let texts = HTMLParser.parse($(".texte").html());
                                                let ps = texts.querySelectorAll('p');
                                                let texte = "";
                                                ps.forEach(p => {
                                                    texte = texte.concat(stripHtml(p.innerHTML));
                                                });
                                                done();
                                                resolve(texte);
                                            }
                                        }
                                    });
                                    c2.queue(link);
                                })
                            );
                        });
                        let i=0;
                        Promise.all(promises).then(contents=>{
                            contents.forEach(content=>{
                               data[i].content = content;
                               i++;
                            });
                            done();
                            resolve(data);
                            console.log(data);
                        }).catch(error=>{
                            reject(error);
                        });
                    }

                }
            });
            c.queue('https://www.elwatan.com/category/edition');
        });
    }

    getLiberteNews() {
        return new Promise((resolve,reject)=> {
            var c = new Crawler({
                maxConnections: 10,
                // This will be called for each crawled page
                callback: function (error, res, done) {
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        let $ = res.$;
                        // $ is Cheerio by default
                        //a lean implementation of core jQuery designed specifically for the server
                        let posts = HTMLParser.parse($("#tab-PostsList>ul").html());
                        let articles = posts.querySelectorAll('li');
                        let data = [];
                        let promises = [];
                        articles.forEach(article=> {
                            let $$ = cheerio.load(article.toString(), {decodeEntities: false});
                            let imageUrl = $$('img').attr('src');
                            let title = $$('.right-side>a').html();
                            let link = 'https://www.liberte-algerie.com'+$$('.right-side>a').attr('href');
                            let description = $$('p').html();
                            let date = $$('.right-side .date').text();
                            let category = 'A la une';
                            data.push({
                                imageUrl: imageUrl ? imageUrl : defaultImageUrl,
                                title: title,
                                description: description,
                                link: link,
                                date: date,
                                category: category,
                                lang: 'FR',
                                source: 'Liberte'

                            });
                            promises.push(
                                new Promise((resolve, reject) => {
                                    var c2 = new Crawler({
                                        maxConnections: 10,
                                        // This will be called for each crawled page
                                        callback: function (error, res, done) {
                                            if (error) {
                                                reject(error);
                                            } else {
                                                let $ = res.$;
                                                let texts = HTMLParser.parse($("#text_core").html());
                                                let ps = texts.querySelectorAll('p');
                                                let texte = "";
                                                ps.forEach(p => {
                                                    texte = texte.concat(stripHtml(p.innerHTML));
                                                });
                                                done();
                                                resolve(texte);
                                            }
                                        }
                                    });
                                    c2.queue(link);
                                })
                            );
                        });
                        let i=0;
                        Promise.all(promises).then(contents=>{
                            contents.forEach(content=>{
                                data[i].content = content;
                                i++;
                            });
                            done();
                            resolve(data);
                            console.log(data);
                        }).catch(error=>{
                            reject(error);
                        });
                    }

                }
            });
            c.queue('https://www.liberte-algerie.com/actualite');
        });
    }

    getLexpressionNews() {
        return new Promise((resolve,reject)=> {
            var c = new Crawler({
                maxConnections: 10,
                // This will be called for each crawled page
                callback: function (error, res, done) {
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        let $ = res.$;
                        // $ is Cheerio by default
                        //a lean implementation of core jQuery designed specifically for the server
                        let posts = HTMLParser.parse($(".list-categories").html());
                        let articles = posts.querySelectorAll('li');
                        let data = [];
                        let promises = [];
                        articles.forEach(article=> {
                            let $$ = cheerio.load(article.toString(), {decodeEntities: false});
                            let imageUrl = $$('img').attr('src');
                            let title = $$('h2>a').html();
                            let link = $$('h2>a').attr('href');
                            let description = $$('p:last-child').text();
                            let date = $$('header>p>span').text();
                            let category = $('.header-a.a').text();
                            data.push({
                                imageUrl: imageUrl ? imageUrl : defaultImageUrl,
                                title: title,
                                description: description,
                                link: link,
                                date: date,
                                category: category,
                                lang: 'FR',
                                source: 'L\'Expression'

                            });
                            promises.push(
                                new Promise((resolve, reject) => {
                                    var c2 = new Crawler({
                                        maxConnections: 10,
                                        // This will be called for each crawled page
                                        callback: function (error, res, done) {
                                            if (error) {
                                                reject(error);
                                            } else {
                                                let $ = res.$;
                                                let texte = stripHtml($(".module-article p").text());
                                                done();
                                                resolve(texte);
                                            }
                                        }
                                    });
                                    c2.queue(link);
                                })
                            );
                        });
                        let i=0;
                        Promise.all(promises).then(contents=>{
                            contents.forEach(content=>{
                                data[i].content = content;
                                i++;
                            });
                            done();
                            resolve(data);
                            console.log(data);
                        }).catch(error=>{
                            reject(error);
                        });
                    }

                }
            });
            c.queue('https://www.lexpressiondz.com/nationale');
        });
    }

    getElChouroukNews() {
        return new Promise((resolve,reject)=> {
            var c = new Crawler({
                maxConnections: 10,
                // This will be called for each crawled page
                callback: function (error, res, done) {
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        let $ = res.$;
                        // $ is Cheerio by default
                        //a lean implementation of core jQuery designed specifically for the server
                        let posts = HTMLParser.parse($(".acategory__list>ul").html());
                        let articles = posts.querySelectorAll('li');
                        let data = [];
                        let promises = [];
                        articles.forEach(article=> {
                            let $$ = cheerio.load(article.toString(), {decodeEntities: false})
                            //console.log(article.innerHTML);
                            let imageUrl = $$('.image>a').attr('data-bg');

                            let title = $$('h2>a').html();
                            let link = $$('h2>a').attr('href');
                            let description = $$('p').text();
                            let date = $$('time').attr('datetime');
                            let category = 'الجزائر';
                            data.push({
                                imageUrl: imageUrl ? imageUrl : defaultImageUrl,
                                title: title,
                                description: description,
                                link: link,
                                date: date,
                                category: category,
                                lang: 'AR',
                                source: 'الشروق'

                            });
                            promises.push(
                                new Promise((resolve, reject) => {
                                    var c2 = new Crawler({
                                        maxConnections: 10,
                                        // This will be called for each crawled page
                                        callback: function (error, res, done) {
                                            if (error) {
                                                reject(error);
                                            } else {
                                                let $ = res.$;
                                                let texte = stripHtml($(".the-content p").text());
                                                done();
                                                resolve(texte);
                                            }
                                        }
                                    });
                                    c2.queue(link);
                                })
                            );
                        });
                        let i=0;
                        Promise.all(promises).then(contents=>{
                            contents.forEach(content=>{
                                data[i].content = content;
                                i++;
                            });
                            done();
                            resolve(data);
                            console.log(data);
                        }).catch(error=>{
                            reject(error);
                        });
                    }

                }
            });
            c.queue('https://www.echoroukonline.com/el-jazaair/');
        });
    }

    getElKhabarNews() {
        return new Promise((resolve,reject)=> {
            var c = new Crawler({
                maxConnections: 10,
                // This will be called for each crawled page
                callback: function (error, res, done) {
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        let $ = res.$;
                        // $ is Cheerio by default
                        //a lean implementation of core jQuery designed specifically for the server
                        let posts = HTMLParser.parse($("#category27").html());
                        let articles = posts.querySelectorAll('.main_article');
                        let data = [];
                        let promises = [];
                        articles.forEach(article=> {
                            let $$ = cheerio.load(article.outerHTML, {decodeEntities: false});

                            let imageUrl = 'https://www.elkhabar.com'+$$('.thumbnail').css('background-image').replace('url(\'','').replace('\')','');

                            let title = $$('.title').html();

                            let link =  'https://www.elkhabar.com'+$$('.thumbnail').parent().attr('href');
                            let description = stripHtml($$('.description').text());
                            let date = $$('.subinfo').text();
                            let category = 'الجزائر';
                            data.push({
                                imageUrl: imageUrl ? imageUrl : defaultImageUrl,
                                title: title,
                                description: description,
                                link: link,
                                date: date,
                                category: category,
                                lang: 'AR',
                                source: 'الخبر'

                            });
                            /*promises.push(
                                new Promise((resolve, reject) => {
                                    var c2 = new Crawler({
                                        maxConnections: 10,
                                        // This will be called for each crawled page
                                        callback: function (error, res, done) {
                                            if (error) {
                                                reject(error);
                                            } else {
                                                let $ = res.$;
                                                let texte = stripHtml($("#article_body_content p").text());
                                                done();
                                                resolve(texte);
                                            }
                                        }
                                    });
                                    c2.queue(link);
                                })
                            );*/
                        });
                        let i=0;
                        Promise.all(promises).then(contents=>{
                            contents.forEach(content=>{
                                data[i].content = content;
                                i++;
                            });
                            done();
                            resolve(data);
                            console.log(data);
                        }).catch(error=>{
                            reject(error);
                        });
                    }

                }
            });
            c.queue('https://www.elkhabar.com/press/category/27/%D9%85%D8%AC%D8%AA%D9%85%D8%B9/');
        });
    }

    getNews() {
        return this.getElKhabarNews();
    }


}

module.exports = NewsService;