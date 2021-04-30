const jwt = require ("jsonwebtoken")
require ("dotenv").config()

const jwtVerify = (req, res, next) => {
    const data = req.body
    const token = data.token

    if (!token) return res.status (406).send ({
        error: true,
        message: "Unidentified token"
    })

    jwt.verify (token, process.env.JWT_KEY, (err, dataToken) => {
        try {
            if (err) throw err
            req.dataToken = dataToken

            next()
            
        } catch (error) {
            console.log (error)
            res.status (500).send ({
                error: true,
                message: error.message
            })
        }
    })
}

module.exports = jwtVerify