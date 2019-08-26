let Parser = require('rss-parser');
let parser = new Parser();
var Crawler = require("crawler");
var HTMLParser = require('node-html-parser');
const cheerio= require('cheerio');
const defaultImageUrl = 'http://www.sclance.com/pngs/no-image-png/no_image_png_935227.png';
const stripHtml = require("string-strip-html");
const helper = require('./helper');

class NewsService {



    getCategoriesFR() {
        return [
            {
                title:'Societe',
                iconURL:'https://icon-library.net/images/more-icon-png/more-icon-png-27.jpg'
            },
            {
                title:'Sport',
                iconURL:'https://icon-library.net/images/more-icon-png/more-icon-png-27.jpg'
            },{
                title:'International',
                iconURL:'https://icon-library.net/images/more-icon-png/more-icon-png-27.jpg'
            },{
                title:'Economie',
                iconURL:'https://icon-library.net/images/more-icon-png/more-icon-png-27.jpg'
            },{
                title:'Culture',
                iconURL:'https://icon-library.net/images/more-icon-png/more-icon-png-27.jpg'
            },{
                title:'Automobile',
                iconURL:'https://icon-library.net/images/more-icon-png/more-icon-png-27.jpg'
            },{
                title:'Histoire',
                iconURL:'https://icon-library.net/images/more-icon-png/more-icon-png-27.jpg'
            },{
                title:'Divers',
                iconURL:'https://icon-library.net/images/more-icon-png/more-icon-png-27.jpg'
            }
        ];
    }

    getCategoriesAR() {
        return [
            {
                title:'مجتمع',
                iconURL:'https://icon-library.net/images/more-icon-png/more-icon-png-27.jpg'
            },{
                title:'رياضة',
                iconURL:'https://icon-library.net/images/more-icon-png/more-icon-png-27.jpg'
            },{
                title:'اقتصاد',
                iconURL:'https://icon-library.net/images/more-icon-png/more-icon-png-27.jpg'
            },{
                title:'العالم',
                iconURL:'https://icon-library.net/images/more-icon-png/more-icon-png-27.jpg'
            },{
                title:'ثقافة',
                iconURL:'https://icon-library.net/images/more-icon-png/more-icon-png-27.jpg'
            },{
                title:'منوعات',
                iconURL:'https://icon-library.net/images/more-icon-png/more-icon-png-27.jpg'
            }
        ];
    }

    getElWatanNews(link,category) {
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
                            let date = helper.convertDateForElWatan($$('.date').text().replace('\n',''));
                            //let category = $$('.category span').html();
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
            c.queue(link);
        });
    }

    getLiberteNews(link,category) {
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
                            let title = $$('.right-side>a').html().replace('\t','').replace('\t\t','').replace('\n','');
                            let link = 'https://www.liberte-algerie.com'+$$('.right-side>a').attr('href');
                            let description = $$('p').html();
                            let date = $$('.right-side .date').text();
                           // let category = category;
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
            c.queue(link);
        });
    }

    getLexpressionNews(link,category) {
        return new Promise((resolve,reject)=> {
            var c = new Crawler({
                maxConnections: 10,
                retries : 5,
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
                            $$('header>p>span>span').remove();
                            let date = $$('header>p>span').text().replace('\n\n','')
                                .replace('\n','').replace('00:00 | ','')
                                .replace('-','/').replace('-','/');
                            //let category = $('.header-a.a').text();
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
            c.queue(link);
        });
    }

    getElChouroukNews(link,category) {
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
                            //let category = 'الجزائر';
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
                                                let texts = HTMLParser.parse($(".the-content").html());
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
            c.queue(link);
        });
    }

    getElKhabarNews(link,category) {
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
                            //let category = 'الجزائر';
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
                                                let texts = HTMLParser.parse($("#article_body_content").html());
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
            c.queue(link);
        });
    }


    // arabe liberte https://www.liberte-algerie.com/liberte-%D8%B9%D8%B1%D8%A8%D9%8A -> Divers

    getFrenchNews() {
        let articles = [];
        let promises = [];
        //El Watan
        promises.push(this.getElWatanNews('https://www.elwatan.com/category/edition/sports','Sport'));
        promises.push(this.getElWatanNews('https://www.elwatan.com/category/edition/economie','Economie'));
        promises.push(this.getElWatanNews('https://www.elwatan.com/category/edition/culture','Culture'));
        promises.push(this.getElWatanNews('https://www.elwatan.com/category/edition/international','International'));
        //Liberte
        promises.push(this.getLiberteNews('https://www.liberte-algerie.com/culture','Culture'));
        promises.push(this.getLiberteNews('https://www.liberte-algerie.com/sport','Sport'));
        promises.push(this.getLiberteNews('https://www.liberte-algerie.com/automobile','Automobile'));
        promises.push(this.getLiberteNews('https://www.liberte-algerie.com/international','International'));
        promises.push(this.getLiberteNews('https://www.liberte-algerie.com/histoire','Histoire'));
        promises.push(this.getLiberteNews('https://www.liberte-algerie.com/magazine','Divers'));
        //L'expression
        promises.push(this.getLexpressionNews('https://www.lexpressiondz.com/internationale','International'));
        promises.push(this.getLexpressionNews('https://www.lexpressiondz.com/sports','Sport'));
        promises.push(this.getLexpressionNews('https://www.lexpressiondz.com/culture','Culture'));
        promises.push(this.getLexpressionNews('https://www.lexpressiondz.com/societe','Societe'));
        promises.push(this.getLexpressionNews('https://www.lexpressiondz.com/economie','Economie'));

        return new Promise((resolve, reject) => {
            Promise.all(promises).then(arrays=> {
                arrays.forEach(array=>{
                    array.forEach(article=>{
                        articles.push(article);
                    });

                });
                let shuffled = helper.shuffle(articles);
                resolve(shuffled);
            }).catch(error => {
                reject(error);
            });
        });

    }

    getArabicNews() {
        let articles = [];
        let promises = [];
        //El Chourouk
        promises.push(this.getElChouroukNews('https://www.echoroukonline.com/iktisad/','اقتصاد'));
        promises.push(this.getElChouroukNews('https://www.echoroukonline.com/world/','العالم'));
        promises.push(this.getElChouroukNews('https://www.echoroukonline.com/sport/riyada-alamia/','رياضة'));
        promises.push(this.getElChouroukNews('https://www.echoroukonline.com/society/','مجتمع'));
        promises.push(this.getElChouroukNews('https://www.echoroukonline.com/takafa-art/','ثقافة'));
        promises.push(this.getElChouroukNews('https://www.echoroukonline.com/monawaat/','منوعات'));
        //El khabar
        promises.push(this.getElKhabarNews('https://www.elkhabar.com/press/category/36/%D8%A7%D9%84%D8%B9%D8%A7%D9%84%D9%85/','العالم'));
        promises.push(this.getElKhabarNews('https://www.elkhabar.com/press/category/38/%D8%B1%D9%8A%D8%A7%D8%B6%D8%A9/','رياضة'));
        promises.push(this.getElKhabarNews('https://www.elkhabar.com/press/category/27/%D9%85%D8%AC%D8%AA%D9%85%D8%B9/','مجتمع'));
        promises.push(this.getElKhabarNews('https://www.elkhabar.com/press/category/204/%D8%AB%D9%82%D8%A7%D9%81%D8%A9-2/','ثقافة'));
        promises.push(this.getElKhabarNews('https://www.elkhabar.com/press/category/28/%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1-%D8%A7%D9%84%D9%88%D8%B7%D9%86/','منوعات'));



        return new Promise((resolve, reject) => {
            Promise.all(promises).then(arrays=> {
                arrays.forEach(array=>{
                    array.forEach(article=>{
                        articles.push(article);
                    });

                });
                let shuffled = this.shuffle(articles);
                resolve(shuffled);
            }).catch(error => {
                reject(error);
            });
        });

    }



}

module.exports = NewsService;