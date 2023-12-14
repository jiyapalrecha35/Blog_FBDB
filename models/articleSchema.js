const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify') //to sanitize html so no malicious code is added in our database and to remove all html characters
const { JSDOM } = require('jsdom') //so that we can use html in nodejs,because node doesnt know how html works
const dompurify = createDomPurify(new JSDOM().window) //create html n purify it


// we want to create markdown to html
const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }

});

articleSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    // markdown to html
    // if markdown exists(#), convert it to sanitised html (to get rid of any malicious code)
    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown))
    }
    next();
});

module.exports = mongoose.model('Article', articleSchema);
