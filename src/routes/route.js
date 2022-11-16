const express = require("express");
const  router = express.Router();
const AuthorControllor = require('../Controller/authorController')
const BlogControllor = require('../Controller/blogController')


//====================Author APIs====================//
router.post('/authors', AuthorControllor.createAuthor)

//====================Blog APIs====================//
router.post('/authors', AuthorControllor.createAuthor)
router.post('/blogs', BlogControllor.createBlog)




module.exports = router