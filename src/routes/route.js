const express = require("express");
const router = express.Router();
const AuthorControllor = require('../Controller/authorController')
const BlogControllor = require('../Controller/blogController')


//====================Author APIs====================//
router.post('/authors', AuthorControllor.createAuthor)

//====================Blog APIs====================//
router.post('/blogs', BlogControllor.createBlog)
router.get('/blogs', BlogControllor.getAllBlogs)
router.put('/blogs/:blogId', BlogControllor.updateBlog)
router.delete('/blogs/:blogId', BlogControllor.deleteBlog)
router.delete('/blogs', BlogControllor.queryDelete)



module.exports = router