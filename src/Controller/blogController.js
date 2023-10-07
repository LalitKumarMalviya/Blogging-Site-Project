const BlogModel = require('../Model/blogModel')
const mongoose = require('mongoose');
const AuthorModel = require('../Model/authorModel')


//-----------------------------[2]-create blog api-------------------------------------\\

const createBlog = async function (req, res) {

    try {
        let data = req.body
        let { title, body, authorId, tags, category, subcategory, isPublished, publishedAt } = data
        console.log(data)

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: 'Please provide something to create!' })
        }

        if (!title || title === "") {
            return res.status(400).send({ status: false, message: "Please provide title of the blog!" })
        }
        title = title.trim()

        if (!body || body === "") {
            return res.status(400).send({ status: false, message: "Please provide body of the blog!" })
        }
        body = body.trim()

        if (!tags || tags === "") {
            return res.status(400).send({ status: false, message: "Please provide tags of the blog!" })
        }
        tags = tags.trim()

        if (!category || category === "") {
            return res.status(400).send({ status: false, message: "Please provide category of the blog!" })
        }
        category = category.trim()

        if (!subcategory || subcategory === "") {
            return res.status(400).send({ status: false, message: "Please provide subcategory of the blog!" })
        }
        subcategory = subcategory.trim()

        if (!authorId || authorId === "") {
            return res.status(400).send({ status: false, message: "Please provide author Id of the blog!" })
        }
        authorId = authorId.trim()
        if (!mongoose.isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, message: 'authorId is invalid!' })
        }

        let validAuthor = await AuthorModel.findById(authorId)
        if (!validAuthor) {
            return res.status(404).send({ status: false, message: 'Author not Found!' })
        }

        if (isPublished === true) {
            publishedAt = Date.now()
        }

        let savedData = await BlogModel.create(data)
        console.log(savedData)
        res.status(201).send({ status: true, data: savedData })

    }

    catch (err) {
        console.log("This is the error:", err.message)
        res.status(500).send({ message: "Error", error: err.message })
    }

}

//------------------------------[3]-get blogs [get api]------------------------------------\\

const getBlogs = async function (req, res) {

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
            return res.status(400).send({ status: false, message: "Please provide something in request" })
        }

        if (!authorId || authorId === 0) {
            return res.status(400).send({ status: false, message: "Please provide author Id!" })
        }
        if (!mongoose.isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, message: "Please provide valid author Id!" })
        }
        let authorExist = await AuthorModel.findById(authorId)
        if (!authorExist) {
            return res.status(404).send({ status: false, message: "user not logged In!" })
        }

        if (tags == "" || subcategory == "" || category == "") {
            { return res.status(400).send({ status: false, message: "Somthing empty in query!" }) }
        }

        let queryBlogs = await BlogModel.find(filter)
        if (queryBlogs.length == 0) {
            return res.status(404).send({ status: false, message: "No such blog is found!" });
        }

        res.status(200).send({ status: true, data: queryBlogs, count: queryBlogs.length })

    }

    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ message: "Error", error: err.message })
    }

}

//----------------------------[4]-update blog [put Api]-------------------------------\\

const updateBlog = async function (req, res) {

    try {
        let data = req.body
        let blogId = req.params.blogId
        let { tags, body, title, subcategory, publishedAt, isPublished } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "No data for update!" })
        }

        if (!mongoose.isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, message: "Please provide valid blogId!" })
        }
        let blogvalid = await BlogModel.findOne({ _id: blogId, isDeleted: false })
        if (!blogvalid) {
            return res.status(404).send({ status: false, message: "blog is not exist it's Deleted!" })
        }

        let updatedBlog = await BlogModel.findOneAndUpdate({ _id: blogId, isDeleted: false },
            {
                $set: {
                    body: body,
                    title: title,
                    isPublished: true,
                    publishedAt: Date.now()
                },
                $push: {
                    tags: tags,
                    subcategory: subcategory
                }
            },
            { new: true, upsert: true }
        )

        res.status(200).send({ status: true, data: updatedBlog });

    } catch (err) {
        console.log("This is error:", err.message)
        return res.status(500).send({ message: "Error", error: err.message })
    }
}

//---------------------------[5]-delete blog [delete Api]------------------------------\\

const deleteBlog = async function (req, res) {

    try {
        let blogId = req.params.blogId

        if (!mongoose.isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, message: "Please provide valid blog Id" })
        }

        let blog = await BlogModel.findOne({ _id: blogId, isDeleted: false })
        if (!blog) {
            return res.status(404).send({ status: false, message: "Blog Not Found Or Already deleted" })
        }

        let deletedBlog = await BlogModel.findByIdAndUpdate
            (
                { _id: blogId },
                { $set: { isDeleted: true, deletedAt: Date.now() } },
                { new: true }
            )

        res.status(200).send({ status: true, data: deletedBlog })

    }

    catch (err) {
        console.log("This is an error:", err.message)
        return res.status(500).send({ message: "Error", error: err.message })
    }

}

//-----------------------------[6]-delete blog By Query-----------------------------------\\

const queryDelete = async function (req, res) {

    try {
        let data = req.query
        let { authorId, tags, subcategory, category } = data

        let filter = {
            ...data,
            isDeleted: false,
            isPublished: false
        }

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide data in query to delete blog!" })
        }

        if (!mongoose.isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, message: "Please provide valid author Id!" })
        }

        if (tags == "" || subcategory == "" || category == "") {
            { return res.status(400).send({ status: false, message: "Somthing empty in query!" }) }
        }

        let blogData = await BlogModel.find(filter)
        if (blogData.length == 0) {
            return res.status(404).send({ status: false, message: "Blog Data Not Found OR Already Deleted!" })
        }

        let deletedData = await BlogModel.updateMany(filter,
            {
                // $set: { isDeleted: true, deletedAt: Date.now() }
            },
            { new: true }
        )

        res.status(200).send({ status: true, data: deletedData })

    }

    catch (err) {
        console.log("This is error:", err.message)
        return res.status(500).send({ message: "Error", error: err.message })
    }

}


module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.queryDelete = queryDelete