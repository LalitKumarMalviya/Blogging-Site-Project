const AuthorModel = require('../Model/authorModel')

const createAuthor = async function (req, res) {

    try {
        let data = req.body

        if (Object.keys(data).length == 0) res.status(400).send({ status: false, msg: 'BAD REQUEST' })

        console.log(data)
        let duplicateEmail = await AuthorModel.findOne({email: data.email})
        if(duplicateEmail) res.status(400).send({status: false, msg: `${data.email} <= email already exist!`})

        let savedData = await AuthorModel.create(data)
        if(!savedData) res.status(400).send({status: false, msg: 'Data not created'})

        console.log(savedData)
        res.status(201).send({ status: true, data: savedData })
    }

    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}


module.exports.createAuthor = createAuthor