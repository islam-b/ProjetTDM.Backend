const express = require('express');
const router = express.Router();
const NewsService = require('./service');
const newsService = new NewsService();
const UserDAO = require('./DAO/userDAO');
const ArticleDAO = require('./DAO/articleDAO');
const BookmarkDAO = require('./DAO/bookmarkDAO');
const userDAO = new UserDAO();
const articleDAO = new ArticleDAO();
const bookmarkDAO = new BookmarkDAO();
var Pusher = require('@pusher/push-notifications-server');
var hash = require('object-hash');
var beams_client = new Pusher({
    instanceId:'a88a7852-c501-40a4-be85-3b66edb00621',
    secretKey: '1B5DBA9A4179B0A7BB600D29D38A8750FE3543615FF2550B0155EE23CC8CC316'
});


FRnews = [];
ARnews = [];
/*newsService.getVideos().then(v=>{
    console.log(v);
}).catch(e=>{

});*/
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

router.get('/bookmarks',(req,res)=>{
    userDAO.findUser(req.query.user).then(u=> {
        if (u === null) {
            res.status(404).json({
                message: "Utilisateur non trouvé."
            });
        } else {
            articleDAO.getArticlesForUser(req.query.user).then(articles=>{
                res.status(200).json(articles);
            }).catch(e=>{
                res.status(500).json({
                    message:"Une erreur s'est produite."
                });
            });
        }
    }).catch(e=>{
        res.status(500).json({
            message:"Une erreur s'est produite."
        });
    });
});

router.post('/user',(req,res)=>{
    userDAO.findUser(req.body.idUser).then(u=>{
        if (u!==null) {
            res.status(409).json({
                message:"Utilisateur existant."
            });
        } else {
            userDAO.createUser(req.body).then(u=>{
                res.status(200).json(u)
            }).catch(e=>{
                res.status(500).json({
                    message:"Une erreur s'est produite."
                });
            });
        }
    }).catch(e=>{
        res.status(500).json({
            message:"Une erreur s'est produite."
        });
    });
});

router.post('/bookmark',(req,res)=> {

    userDAO.findUser(req.query.user).then(user => {
        if (user!=null) {
            articleDAO.findArticle(req.body.idArticle).then(article=>{
                if (article!==null) {
                    bookmarkDAO.createBookmark(article.idArticle,req.query.user).then(bm=>{
                        res.status(200).json(bm);
                    }).catch(e => {
                        res.status(500).json({
                            message:"Une erreur s'est produite."
                        })
                    });
                } else {
                    articleDAO.createArticle(req.body).then(article=>{
                        bookmarkDAO.createBookmark(article.idArticle,req.query.user).then(bm=>{
                            res.status(200).json(bm);
                        }).catch(e => {
                            res.status(500).json({
                                message:"Une erreur s'est produite."
                            })
                        });
                    }).catch(e => {
                        res.status(500).json({
                            message:"Une erreur s'est produite."
                        })
                    });
                }
            })
        }else {
            res.status(404).json({
                message:"Utilisateur non trouvé."
            })
        }
    }).catch(e => {
        res.status(500).json({
            message:"Une erreur s'est produite."
        })
    });
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
    };
let keyevent = "CATEGORIE"+hash(news.category);
let keychannel = "SOURCE"+hash(news.source);
console.log(keyevent + "\n"+keychannel);

beams_client.publishToInterests([keychannel+keyevent],{
    fcm:{
        notification:{
            title:news.title,
            body:news.description
        }
    }
}).then(publichRES=>{
    console.log('JUST puiblished',publichRES.publishId)
}).catch(e=>{
    console.log("error "+e)
});
    news.idArticle = hash(news.link);
    res.status(200).json(news);
});


module.exports = router;
