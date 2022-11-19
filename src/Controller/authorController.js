const jwt = require('jsonwebtoken')
const AuthorModel = require('../Model/authorModel')

const createAuthor = async function (req, res) {

    try {
        let data = req.body

        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, msg: 'BAD REQUEST' }) }

        console.log(data)
        let duplicateEmail = await AuthorModel.findOne({ email: data.email })
        if (duplicateEmail) { return res.status(400).send({ status: false, msg: `${data.email} <= email already exist!` }) }

        let savedData = await AuthorModel.create(data)
        if (!savedData) { return res.status(400).send({ status: false, msg: 'Data not created' }) }

        console.log(savedData)
        res.status(201).send({ status: true, data: savedData })
    }

    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}

const loginAuthor = async function (req, res) {

    try {
        let email = req.body.email
        let password = req.body.password

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "Please Enter email and password" })
        }

        let author = await AuthorModel.findOne({ email: email, password: password })
        if (!author) { return res.status(404).send({ status: false, msg: "email or password not correct" }) }

        let payload = {
            authorId: author._id.toString()
        }
        let token = jwt.sign(payload, "My-Blog-Project-Secret-key$99775")

        console.log("This is the token ==>", token)

        res.status(201).send({ status: true, token: token })

        //we can send token in response header also as per our requirment.
        // res.status(200).setHeader('x-api-key', token)

    }
    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }

}


module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor