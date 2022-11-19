const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const BlogModel = require('../Model/blogModel')

//==============================[Authantication]=================================\\

const authentication = function (req, res, next) {
    try {
        let token = req.headers['x-api-key']

        let verifiedToken = jwt.verify(token, "My-Blog-Project-Secret-key$99775")
        if (!verifiedToken) { return res.status(401).send({ status: false, msg: "token is incorrect" }) }

        req.verifiedToken = verifiedToken


    } catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }

    next()
}


//==============================[Authorisation][for Path params]=====================================\\

const authByPath = async function (req, res, next) {
    try {
        if (!req.verifiedToken) { return res.status(401).send({ status: false, msg: "token is incorrect" }) }

        let loggedInAuthorId = req.verifiedToken.authorId
        let blogId = req.params.blogId

        if (!mongoose.Types.ObjectId.isValid(blogId)) { return res.status(400).send({ status: false, msg: "Blog id is not valid" }) }

        let findBlogId = await BlogModel.findById(blogId).select({ authorId: 1, _id: 0 })

        let blogAuthorId = findBlogId.authorId

        if (blogAuthorId != loggedInAuthorId) { return res.status(403).send({ status: false, msg: "Author logged is not allowed to modify the requested author's blog data" }) }
    }

    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }

    next()

}

//==============================[Authorisation][for Query params]=====================================\\

const authByQuery = async function (req, res, next) {
    try {

        if (!req.verifiedToken) { return res.status(401).send({ status: false, msg: "token is incorrect" }) }
        let loggedInAuthorId = req.verifiedToken.authorId

        let authorId = req.query.authorId

        if (!mongoose.Types.ObjectId.isValid(authorId)) { return res.status(400).send({ status: false, msg: "Author id is not valid" }) }

        if (authorId != loggedInAuthorId) { return res.status(403).send({ status: false, msg: "Author logged is not allowed to modify the requested author's blog data" }) }

    }

    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }
    next()
}


module.exports.authentication = authentication
module.exports.authByPath = authByPath
module.exports.authByQuery = authByQuery

