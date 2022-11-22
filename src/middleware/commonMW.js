const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const BlogModel = require('../Model/blogModel')

//----------------------------[Authantication]-------------------------------\\

const authentication = function (req, res, next) {
    try {
        let token = req.headers['x-api-key']

        let verifiedToken = jwt.verify(token, "My-Blog-Project-Secret-key$99775")
        if (!verifiedToken) {
            return res.status(401).send({ status: false, message: "token is invalid" })
        }

        req.verifiedToken = verifiedToken


    } catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ message: "Error", error: err.message })
    }

    next()
}

//-------------------------------------------------------------------------------\\
//--------------------------------EXTRA WORKS-------------------------------------\\
//---------------------------------------------------------------------------------\\

//------------------------[Authorisation][for Path params]---------------------------\\

const authForPath = async function (req, res, next) {
    try {

        let loggedInAuthorId = req.verifiedToken.authorId
        let blogId = req.params.blogId

        if (!mongoose.isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, message: "Blog id is not valid" })
        }

        let findBlogId = await BlogModel.findById(blogId)
        if (!findBlogId) {
            return send.status(404).send({ status: false, message: "Blog is not Found!" })
        }

        let blogAuthorId = findBlogId.authorId
        if (blogAuthorId != loggedInAuthorId) {
            return res.status(403).send({
                status: false, message: "Author logged is not allowed to modify the requested author's blog data"
            })
        }
    }

    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ message: "Error", error: err.message })
    }

    next()

}

//---------------------[Authorisation][for Query params]-----------------------------\\

const authForQuery = async function (req, res, next) {
    try {

        let loggedInAuthorId = req.verifiedToken.authorId
        let authorId = req.query.authorId

        if (!mongoose.isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, message: "Author id is not valid" })
        }

        if (authorId != loggedInAuthorId) {
            return res.status(403).send({
                status: false, message: "Author logged is not allowed to modify the requested author's blog data"
            })
        }

    }

    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ message: "Error", error: err.message })
    }
    
    next()
}


module.exports.authentication = authentication
module.exports.authForPath = authForPath
module.exports.authForQuery = authForQuery

