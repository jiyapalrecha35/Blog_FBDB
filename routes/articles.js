const express = require('express');
const router = express.Router();
const Article = require('../models/articleSchema');

//whenever someone presses new article tab,gets redirected to views/articles/new.ejs
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
});


//whenever someone wants to edit a article,gets the views/articles/edit.ejs
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})


router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'));


//to get/show a particular article on screen based on the slug
router.get('/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug })
        if (article === null) {
            res.redirect('/')
        }
        res.render('articles/show', { article: article })
    } 
    catch (err) {
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
});

//posting a new article
router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'));



//delete a article baed on id of the article
router.delete('/:id', async (req, res) => {
    let id = req.params.id
    await Article.findByIdAndDelete(id)
    res.redirect('/') //after deleting redirect to home page
})


function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        try {
            article = await article.save();
            res.redirect(`/articles/${article.slug}`);
        } catch (err) {
            res.render(`articles/${path}`, { article: article });
        }
    }
}

module.exports = router;
