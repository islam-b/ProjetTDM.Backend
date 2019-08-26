const express = require('express');
const router = express.Router();
const NewsService = require('./service');
const newsService = new NewsService();


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
    let categories;
    if (req.query.lang !== "FR") categories = newsService.getCategoriesAR();
    else categories = newsService.getCategoriesFR();
    res.status(200).json(categories);
});


module.exports = router;
