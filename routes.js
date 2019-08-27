const express = require('express');
const router = express.Router();
const NewsService = require('./service');
const newsService = new NewsService();
var Pusher = require('pusher');
var hash = require('object-hash');
var channels_client = new Pusher({
  appId: '850594',
  key: '4a2d823b8c2dd69e64bd',
  secret: 'a239dcecf3ffc7a334f3',
  cluster: 'eu',
  encrypted: true
});


FRnews = [];
ARnews = [];
newsService.getFrenchNews().then(articles=>{
    FRnews = articles;
    console.log("FINALLY"+FRnews.length);
}).catch(e=>{
    FRnews = null;
});
/*newsService.getArabicNews().then(articles=>{
    ARnews = articles;
    console.log("FINALLY"+ARnews.length);
}).catch(e=>{
    console.log(e);
    ARnews = null;
});*/

router.get('/news',(req,res)=>{
    let news = FRnews;
    if (req.query.lang!=="FR") news = ARnews;
    if (news !== null) {
        let filtered = [];
        if (req.query.category) {
            filtered = news.filter(n => {
                return n.category === req.query.category;
            });
        } else filtered = news;
        res.status(200).json(filtered);
    }
    else res.status(500).json(null);
});


router.get('/categories',(req,res)=>{
    let categories = newsService.getCategories();
    res.status(200).json(categories);
});

router.get('/sources',(req,res)=>{
    let categories = newsService.getSources();
    res.status(200).json(categories);
});

router.get('/post',(req,res)=>{
    let news ={
        imageUrl: 'http://www.sclance.com/pngs/no-image-png/no_image_png_935227.png',
                                title: "hello",
                                description: "hello world",
                                link: "link",
                                date: "10/10/2010",
                                category: "Sport",
                                lang: 'FR',
                                source: 'El Watan'
    }
let keyevent = "CATEGORIE"+hash(news.category)
let keychannel = "SOURCE"+hash(news.source)
console.log(keyevent + "\n"+keychannel)
channels_client.trigger(keychannel, keyevent, news);
    news.idArticle = hash(news.link)
    res.status(200).json(news);
});


module.exports = router;
