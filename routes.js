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
var schedule = require('node-schedule');


let FRnews = [];
let ARnews = [];
let videos=[];
let previousFRlist=[];
let previousARlist=[];
let promises=[];
promises.push(newsService.getFrenchNews());
promises.push(newsService.getArabicNews());
promises.push(newsService.getVideos());
Promise.all(promises).then(array=>{

    FRnews = array[0];
    ARnews = array[1];
    videos=array[2];
    Object.assign(previousFRlist,FRnews);
    Object.assign(previousARlist,ARnews);

    schedule.scheduleJob('/30 * * * 1-5', function(firedate){
        console.log("\n\n*******************************"+firedate+"*************************\n\n");
        updateArticles();
    });
});

function updateArticles() {
    newsService.getFrenchNews().then(articles=>{
        Object.assign(previousFRlist,FRnews);
        FRnews = articles;
        notifyChanges(previousFRlist,FRnews);
        console.log("FINALLY"+FRnews.length);
    }).catch(e=>{
        FRnews = null;
    });
    newsService.getArabicNews().then(articles=>{
        Object.assign(previousARlist,ARnews);
        ARnews = articles;
        notifyChanges(previousARlist,ARnews);
        console.log("FINALLY"+ARnews.length);
    }).catch(e=>{
        console.log(e);
        ARnews = null;
    });
    newsService.getVideos().then(v=>{
        videos=v;
        console.log(v);
    }).catch(e=>{

    });
}
function notifyChanges(oldList,newsList) {

    let changes=[];
    newsList.forEach(newArticle=>{
        let found=oldList.find(oldArticle=>{
            return oldArticle.idArticle === newArticle.idArticle
        });
        if (found===null) changes.push(newArticle)
    });

    changes.forEach(item=>{
        let keyevent = "CATEGORIE"+hash(item.category);
        let keychannel = "SOURCE"+hash(item.source);
        console.log(keyevent + "\n"+keychannel);

        beams_client.publishToInterests([keychannel+keyevent],{
            fcm:{
                notification:{
                    title:item.title,
                    body:item.description
                }
            }
        }).then(publichRES=>{
            console.log('JUST puiblished article ',publichRES.publishId+" article:"+item.title)
        }).catch(e=>{
            console.log("error "+e)
        });
    });
}

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
        /*let page =0;
        if(req.query.page!==null) page = parseInt(req.query.page);
        let array  =filtered.slice(page * 10, (page + 1) * 10);*/
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
router.get('/videos',(req,res)=>{
  
    res.status(200).json(videos);
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
                    message:"Une erreur s'est produite."+e
                });
            });
        }
    }).catch(e=>{
        res.status(500).json({
            message:"Une erreur s'est produite."
        });
    });
});

router.delete('/bookmark/:id',(req,res)=>{
    let userId= req.query.user;
    userDAO.findUser(userId).then(user=>{
        if(user!==null) {
            bookmarkDAO.deleteBookmark(req.params.id,userId).then(deleted=>{
                if(deleted) {
                    res.status(200).json({
                        message:"Signet supprimé."
                    })
                } else {
                    res.status(404).json({
                        message: "Signet non trouvé."
                    });
                }

            }).catch(e=>{
                res.status(500).json({
                    message: "Une erreur s\'est produite."
                });
            });
        } else {
            res.status(404).json({
                message: "Utilisateur non trouvé."
            });
        }
    })
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
