const express = require('express')
const app = express()
const PORT = process.env.PORT || 1200
const articleRouter = require('./routes/articles')
const dbConnection = require('./config/dbConn')
const Article = require('./models/articleSchema')
const methodOverride = require('method-override')

//view engine converts ejs to html
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
dbConnection();

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'descending' })
    res.render('articles/index', { article: articles })
})

app.use('/articles', articleRouter)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})