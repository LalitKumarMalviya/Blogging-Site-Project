const BlogModel = require('../Model/blogModel')
const mongoose = require('mongoose');
const AuthorModel = require('../Model/authorModel');


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


const createBlog = async function (req, res) {

    try {
        let data = req.body
        let authorId = data.authorId

        if (Object.keys(data).length === 0) {
            res.status(400).send({ status: false, msg: 'BAD REQUEST' })
        }

        if (!isValidObjectId(authorId)) {
            res.status(400).send({ status: false, msg: 'authorId is invalid!' })
        }

        if (data.tags || data.tags === "") {
            if (!isValidArray(data.tags)) {
                res.status(400).send({ status: false, msg: "tags are empty" })
            }
        }

        if (data.subcategory || data.subcategory === "") {
            if (!isValidArray(data.subcategory)) {
                res.status(400).send({ status: false, msg: "subcategory are empty" })
            }
        }

        let validAuthor = await AuthorModel.findById(authorId)
        if (!validAuthor) {
            res.status(400).send({ status: false, msg: 'Author not Found!' })
        }

        let savedData = await BlogModel.create(data)
        console.log(savedData)

        if (!savedData) {
            res.status(400).send({ status: false, msg: 'Data not created' })
        }

        res.status(201).send({ status: true, data: savedData })
    }

    catch (err) {
        console.log("This is the error:", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }

}

const getAllBlogs = async function (req, res) {

    try {
        let data = req.query
        let { tags, category, authorId, subcategory } = data
        console.log(data)

        if (Object.keys(data).length > 0) {

            if (tags === "") {
                if (!isValidArray(tags)) {
                    res.status(400).send({ status: false, msg: "tags are empty!" })
                }
            }

            if (category === "") {
                if (!objectValue(category)) {
                    res.status(400).send({ status: false, msg: "please input category" })
                }
            }

            if (authorId || authorId === "") {
                if (!isValidObjectId(authorId)) {
                    res.status(400).send({ status: false, msg: "authorId is invalid" })
                }
            }

            if (subcategory === "") {
                if (!isValidArray(subcategory)) {
                    res.status(400).send({ status: false, msg: "authorId is invalid" })
                }
            }

            let filtreBlog = await BlogModel.find(data)
            if (!filtreBlog) { res.status(404).send({ status: true, msg: "blogs not found" }) }
            else { res.status(200).send({ status: true, data: filtreBlog }) }

        } else {

            let allBlogs = await BlogModel.find({ isPublished: true, isDeleted: false })
            if (!allBlogs) { res.status(404).send({ status: false, msg: "blogs not Found" }) }
            else { res.status(200).send({ status: true, data: allBlogs }) }
        }
    }

    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }

}



module.exports.createBlog = createBlog
module.exports.getAllBlogs = getAllBlogs