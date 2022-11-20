const express = require("express");
const router = express.Router();
const AuthorControllor = require('../Controller/authorController')
const BlogControllor = require('../Controller/blogController')
const MW = require('../middleware/commonMW')


//====================Author APIs====================//
router.post('/authors', AuthorControllor.createAuthor)
router.post('/login', AuthorControllor.loginAuthor)


//====================Blog APIs====================//
router.post('/blogs', MW.authentication, BlogControllor.createBlog)
router.get('/blogs', MW.authentication, MW.authForQuery, BlogControllor.getAllBlogs)
router.put('/blogs/:blogId', MW.authentication, MW.authForPath, BlogControllor.updateBlog)
router.delete('/blogs/:blogId', MW.authentication, MW.authForPath, BlogControllor.deleteBlog)
router.delete('/blogs', MW.authentication, MW.authForQuery, BlogControllor.queryDelete)



module.exports = router