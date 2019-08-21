const express = require('express');
const router = express.Router();
const NewsService = require('./service');
const newsService = new NewsService();

/*langue , image, titre, source, datepub, content, categorie */

const  sources = [

    {
        name:'LIBERTE',
        lang:'FR',
        link:'https://www.liberte-algerie.com/article/feed'
    },
    /*{
        name:'ELMOUDJAHID',
        lang:'FR',
        link:'http://feeds.feedburner.com/ElmoudjahidArticles'
    },
    {
        name:'ALGERIE24',
        lang:'FR',
        link:'https://algerie24.net/feed'
    },
    {
        name:'ELWATAN',
        lang:'FR',
        link:'https://www.elwatan.com/feed'
    }*/];

/*let items = [];

Promise.all(newsService.init(sources)).then(feeds=>{
    feeds.forEach(feed => {
        feed.items.forEach(item => {
            items.push(item);
            /* pubDate, title, creator, content:encoded, dc:creator, content, contentSnippet, categories, guid, isoDate
        });
    });
}).catch(e=>{
   console.log(e);
});*/

router.get('/news',(req,res)=>{
    newsService.getNews().then(articles=>{
        res.status(200).json(articles);
    }).catch(e=>{
       res.status(500).json(e);
    });

});


module.exports = router;