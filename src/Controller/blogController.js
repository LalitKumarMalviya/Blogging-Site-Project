const BlogModel = require('../Model/blogModel')
const mongoose = require('mongoose');
const AuthorModel = require('../Model/authorModel')


const isValidObjectId = (objectId) => { return mongoose.Types.ObjectId.isValid(objectId) }

const isValidArray = function (value) {
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            if (value[i].trim().length === 0 || typeof (value[i]) !== "string") { return false }
        }
        return true
    } else { return false }
}

const objectValue = function (value) {
    if (typeof value === 'undefined' || value === null) { return false }
    if (typeof value === 'string' && value.trim().length === 0) { return false }
    { return true }
}

// ========================[CreateBlog]==================================

const createBlog = async function (req, res) {

    try {
        let data = req.body
        let authorId = data.authorId
        console.log(data)

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, msg: 'Please provide something to create!' })
        }

        if (data.tags || data.tags === "") {
            if (!isValidArray(data.tags)) {
                return res.status(400).send({ status: false, msg: "tags are empty" })
            }
        }

        if (data.subcategory || data.subcategory === "") {
            if (!isValidArray(data.subcategory)) {
                return res.status(400).send({ status: false, msg: "subcategory are empty" })
            }
        }

        if (!isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, msg: 'authorId is invalid!' })
        }

        let validAuthor = await AuthorModel.findById(authorId)
        if (!validAuthor) {
            return res.status(404).send({ status: false, msg: 'Author not Found!' })
        }

        let savedData = await BlogModel.create(data)
        console.log(savedData)
        res.status(201).send({ status: true, data: savedData })

    }

    catch (err) {
        console.log("This is the error:", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }

}

// ========================[getAllBlogs-byQuery]==============================

const getAllBlogs = async function (req, res) {

    try {
        let data = req.query
        let { tags, category, authorId, subcategory } = data

        let filter = {
            ...data,
            isDeleted: false,
            isPublished: true
        }

        console.log(data)

        if (Object.keys(data).length === 0) {
            let getAllBlogs = await BlogModel.find({ isDeleted: false, isPublished: true })
            return res.status(200).send({ status: true, data: getAllBlogs })
        }

        if (authorId || authorId === "") {
            if (!isValidObjectId(authorId)) {
                return res.status(400).send({ status: false, msg: "authorId is invalid" })
            }
        }

        let authorExist = await AuthorModel.findById(authorId)
        if (!authorExist) { return res.status(404).send({ status: false, msg: "Blog is not Exist with this author Id" }) }

        if (tags === "") {
            if (!isValidArray(tags)) {
                return res.status(400).send({ status: false, msg: "please input tag!" })
            }
        }

        if (category === "") {
            if (!objectValue(category)) {
                return res.status(400).send({ status: false, msg: "please input category!" })
            }
        }

        if (subcategory === "") {
            if (!isValidArray(subcategory)) {
                return res.status(400).send({ status: false, msg: "authorId is invalid" })
            }
        }

        let queryBlogs = await BlogModel.find(filter)
        if (queryBlogs.length == 0) { return res.status(404).send({ status: false, message: "No blog is found" }); }

        res.status(200).send({ status: true, data: queryBlogs })

    }

    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }

}

// ========================[updateBlog]==================================

const updateBlog = async function (req, res) {

    try {

        let { tags, body, title, subcategory } = req.body

        let blogId = req.params.blogId

        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, msg: "blogId is invalid!" })
        }

        if (Object.keys(req.body).length === 0) {
            let updated = await BlogModel.findOneAndUpdate
                (
                    { _id: blogId, isDeleted: false },
                    { $set: { isPublished: true, publishedAt: new Date() } },
                    { new: true }
                )

            if (!updated) { return res.status(404).send({ status: false, msg: "Blog not Found OR already deleted!" }) }

            return res.status(200).send({ status: true, data: updated })
        }

        if (tags === "") {
            if (!isValidArray(tags)) {
                return res.status(400).send({ status: false, msg: "tags are empty!" })
            }
        }

        if (subcategory === "") {
            if (!isValidArray(subcategory)) {
                return res.status(400).send({ status: false, msg: "authorId is invalid" })
            }
        }

        let updatedBlog = await BlogModel.findOneAndUpdate(
            { _id: blogId, isDeleted: false },
            {
                $set: { title: title, body: body },
                $push: { subcategory: subcategory, tags: tags }
            },
            { new: true }
        )

        res.status(200).send({ status: true, data: updatedBlog });

    } catch (err) {
        console.log("This is error:", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}

// ========================[deleteblog]==================================

const deleteBlog = async function (req, res) {

    try {
        let blogId = req.params.blogId

        if (!isValidObjectId(blogId)) { res.status(401).send({ status: false, msg: "blogId is invalid" }) }

        let blog = await BlogModel.findOne({ _id: blogId, isDeleted: false })
        if (!blog) { return res.status(404).send({ status: false, msg: "Blog Not Found Or Already deleted" }) }

        let deleteSavedBlog = await BlogModel.findByIdAndUpdate(
            { _id: blogId, isDeleted: false },
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        )

        if (!deleteSavedBlog) {
            return res.status(404).send({ status: false, msg: "Blog not found or Blog already deleted" })
        }

        res.status(200).send({ status: true, data: deleteSavedBlog })
    }

    catch (err) {
        console.log("This is error:", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }

}

// ========================[deleteblogByQuery]==================================

const queryDelete = async function (req, res) {

    try {
        let { authorId, tags, subcategory, category } = req.query

        if (Object.keys(req.query).length == 0) { return res.status(400).send({ status: false, msg: "provide data in query to delete!" }) }

        if (!isValidObjectId(authorId)) { return res.status(400).send({ status: false, msg: "Author Id is invalid!" }) }

        if (tags == "" || subcategory == "" || category == "") {
            { return res.status(400).send({ status: false, msg: "Somthing empty in query!" }) }
        }

        let blogData = await BlogModel.find({ ...req.query, isDeleted: false, isPublished: false })
        if (blogData == 0) { return res.status(404).send({ status: false, msg: "Blog Data Not Found OR Already Deleted!" }) }

        let deletedData = await BlogModel.updateMany
            (
                { ...req.query, isDeleted: false, isPublished: false },
                { $set: { isDeleted: true, deletedAt: new Date() } },
                { new: true }
            )

        res.status(200).send({ status: true, data: deletedData })

    }

    catch (err) {
        console.log("This is error:", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }

}


module.exports.createBlog = createBlog
module.exports.getAllBlogs = getAllBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.queryDelete = queryDelete