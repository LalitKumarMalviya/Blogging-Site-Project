const jwt = require('jsonwebtoken')
const AuthorModel = require('../Model/authorModel')

//-------------------------------regex-----------------------------//

let nameRegex = /^[a-zA-Z]{1,20}$/

let emailRegex = /^[a-z]{1}[a-z0-9._-]{1,100}[@]{1}[a-z]{2,15}[.][a-z]{2,10}$/

// let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/


//----------------------------[1]-create author api-----------------------------//


const createAuthor = async function (req, res) {

    try {
        let data = req.body
        let { fname, lname, title, email, password } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide all the Details!" })
        }

        if (!fname || fname == "") {
            return res.status(400).send({ status: false, message: "Please provide fname!" })
        }
        fname = fname.trim()
        if (!nameRegex.test(fname)) {
            return res.status(400).send({ status: false, message: "Please provide valid fname!" })
        }

        if (!lname || lname == "") {
            return res.status(400).send({ status: false, message: "Please provide lname!" })
        }
        lname = lname.trim()
        if (!nameRegex.test(lname)) {
            return res.status(400).send({ status: false, message: "Please provide valid lname!" })
        }

        if (!title || title == "") {
            return res.status(400).send({ status: false, message: "Please provide valid title!" })
        }
        title = title.trim()
        if (!(["Mr", "Mrs", "Miss"].includes(title))) {
            return res.status(400).send({ status: false, message: "Please provide valid title!" })
        }

        if (!email || email == "") {
            return res.status(400).send({ status: false, message: "Please provide email!" })
        }
        email = email.trim()
        if (!emailRegex.test(email)) {
            return res.status(400).send({ status: false, message: "Please provide valid email!" })
        }
        let checkEmail = await AuthorModel.findOne({ email: email })
        if (checkEmail) {
            return res.status(403).send({ status: false, message: "email already exist , Provide another!" })
        }

        if (!password || password == "") {
            return res.status(400).send({ status: false, message: "Please provide password!" })
        }
        password = password.trim()
        if (!passwordRegex.test(password)) {
            return res.status(400).send({ status: false, message: "Please provide valid password!" })
        }

        let savedData = await AuthorModel.create(data)
        res.status(201).send({ status: true, data: savedData })

    }

    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ error: "Error", error: err.message })
    }
}

//---------------------------login author Api----------------------------//

const loginAuthor = async function (req, res) {

    try {
        let email = req.body.email
        let password = req.body.password

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please Enter email and password" })
        }

        if (!email || email == "") {
            return res.status(400).send({ status: false, message: "Please provide email to login!" })
        }
        if (!emailRegex.test(email)) {
            return res.status(400).send({ status: false, message: "Please provide valid email!" })
        }

        if (!password || password == "") {
            return res.status(400).send({ status: false, message: "Please provide password to login!" })
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).send({ status: false, message: "Please provide valid password!" })
        }

        let author = await AuthorModel.findOne({ email: email, password: password })
        if (!author) {
            return res.status(401).send({ status: false, message: "username or password is not correct" })
        }

        //--------------jwt token creation------------//
        let payload = { authorId: author._id.toString() }
        let token = jwt.sign(payload, "My-Blog-Project-Secret-key$99775")

        res.setHeader('x-api-key', token)
        res.status(201).send({ status: true, token: token })

    }
    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ error: "Error", error: err.message })
    }
}


module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor