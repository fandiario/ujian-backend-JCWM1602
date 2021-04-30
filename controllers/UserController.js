const validator = require ("validator")
const jwt = require ('jsonwebtoken')

require ("dotenv").config()
const db = require ("../connection/Connection")


const onRegisterUser = (req, res) => {
    try {
        let data = req.body
        let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        let uidUser = Date.now()

        if (!data.username || !data.email || !data.password) throw ({message: "Please type in your username, email and password."})
        if (!(validator.isEmail (data.email))) throw ({message: "Invalid email format"})
        if (data.password.length < 6 ) throw ({message: "Min. password length is 6 characters with number and special character"})
        if (regex.test (data.password)) throw ({message: "Min. password length is 6 characters with number and special character"})
        if (data.username.length < 6) throw ({message: "Min username length is 6 characters"})

        let queryCheck = `SELECT * FROM users WHERE email = '${data.email}'`
        db.query (queryCheck, (err, result) => {
            try {
                if (err) throw err

                if (result.length === 0) {
                    jwt.sign ({uid: uidUser, role: 2}, process.env.JWT_KEY, (err, token) => {

                        try {
                            if (err) throw err

                            let dataToSend = {
                                username: data.username,
                                email: data.email,
                                password: data.password,
                                uid: uidUser
                            }

                            let queryInsert = `INSERT INTO users SET ?`
                            db.query (queryInsert, dataToSend, (err, result) => {
                                try {
                                    if (err) throw err

                                    // console.log(result)

                                    res.status (200).send ({
                                        id: result.insertId,   
                                        uid: uidUser,
                                        username: data.username,
                                        email: data.email,
                                        token: token
                                    })
                                    
                                } catch (error) {
                                    console.log (error)
                                    res.status(500).send ({
                                        error: true,
                                        message: error.message
                                    }) 
                                }
                            })
                            
                        } catch (error) {
                            console.log (error)
                            res.status(500).send ({
                                error: true,
                                message: "Error jwtToken Generator"
                            })
                        }
                    })

                    
                }
                
            } catch (error) {
                console.log (error)
                res.status(500).send ({
                    error: true,
                    message: error.message
                }) 
            }
        })
        
        



    } catch (error) {
        console.log (error)
        res.status(406).send ({
            error: true,
            message: error.message
        })
    }
}

const onLoginUser = (req, res) => {
    try {
        let data = req.body
        // let uidUser = Date.now()

        if(!data.password || !data.email && !data.user) throw ({message: "Please log in with your username or email with password"})
                
        if (data.user) {
            let queryCheck = `SELECT * FROM users WHERE username = '${data.user}' AND password = '${data.password}' AND status = 1`
            db.query (queryCheck, (err, result) => {
                try {
                    if (err) throw err
                    // console.log (result)

                    if (result.length === 1) {
                        jwt.sign ({uid: result[0].uid, role: result[0].role}, process.env.JWT_KEY, (err, token) => {
                            try {
                                if (err) throw err

                                res.status(200).send ({
                                    id: result[0].id,
                                    uid: result[0].uid,
                                    username: result[0].username,
                                    email: result[0].email,
                                    status: result[0].status,
                                    role: result[0].role,
                                    token: token
                                })

                                console.log (result[0])
                                
                            } catch (error) {
                                console.log (error)
                                res.status(500).send ({
                                    error: true,
                                    message: "Error jwtToken Generator"
                                })
                            }
                        })
                    } else {
                        res.status (200).send ({
                            error: true,
                            message: "Unidentified email, username or password"
                        })
                    }
                    
                } catch (error) {
                    console.log (error)
                    res.status(500).send ({
                        error: true,
                        message: error.message
                    })
                }
            })


        } else if (data.email){
            let queryCheck = `SELECT * FROM users WHERE email = '${data.email}' AND password = '${data.password}' AND status = 1`
            db.query (queryCheck, (err, result) => {
                try {
                    if (err) throw err

                    if (result.length === 1) {
                        jwt.sign ({uid: uidUser, role: result[0].role}, process.env.JWT_KEY, (err, token) => {
                            try {
                                if (err) throw err

                                res.status(200).send ({
                                    id: result[0].id,
                                    uid: result[0].uid,
                                    username: result[0].username,
                                    email: result[0].email,
                                    status: result[0].status,
                                    role: result[0].role,
                                    token: token
                                })
                                
                            } catch (error) {
                                console.log (error)
                                res.status(500).send ({
                                    error: true,
                                    message: "Error jwtToken Generator"
                                })
                            }
                        })
                    } else {
                        res.status (200).send ({
                            error: true,
                            message: "Unidentified email, username or password"
                        })
                    }
                    
                } catch (error) {
                    console.log (error)
                    res.status(500).send ({
                        error: true,
                        message: error.message
                    })
                }
            })
        }
        
    } catch (error) {
        console.log (error)
        res.status(406).send ({
            error: true,
            message: error.message
        }) 
    }
}

const onDeactivateUser = (req, res) => {
    let data = req.dataToken
    console.log (data)

    let queryCheck = `SELECT * FROM users WHERE uid = '${data.uid}'`
    db.query (queryCheck, (err, result) => {
        try {
            if (err) throw err
            // console.log (result)

            if (result.length === 1 && result[0].status === 1){
                let queryUpdate = `UPDATE users SET status = 2 WHERE uid = '${data.uid}'`
                db.query (queryUpdate, (err, result) => {
                    try {
                        if (err) throw err

                        let queryCheck = 
                        `
                            SELECT * FROM users
                            JOIN status ON status.id = users.status
                            WHERE users.uid = '${data.uid}';
                        `

                        db.query (queryCheck, (err, result) => {
                            try {
                                if (err) throw err
                                // console.log (result)

                                res.status(200).send ({
                                    uid: data.uid,
                                    status: result[0].status
                                })
                                
                            } catch (error) {
                                console.log (error)
                                res.status(500).send ({
                                    error: true,
                                    message: error.message
                                })
                            }
                        })

                        // res.status(200).send ({
                        //     uid: data.uid,
                        //     status: "deactivate"
                        // })
                        
                    } catch (error) {
                        console.log (error)
                        res.status(500).send ({
                            error: true,
                            message: error.message
                        })
                    }
                })


            } else {
                res.status (200).send ({
                    error: true,
                    message: "Unidentified user"
                })
            }

        } catch (error) {
            console.log (error)
            res.status(500).send ({
                error: true,
                message: error.message
            })
        }
    })

}

const onActivateUser = (req, res) => {
    let data = req.dataToken
    console.log (data)

    let queryCheck = `SELECT * FROM users WHERE uid = '${data.uid}'`
    db.query (queryCheck, (err, result) => {
        try {
            if (err) throw err
            console.log (result)

            if (result.length === 1 && result[0].status === 2){

                let queryUpdate = `UPDATE users SET status = 1 WHERE uid = '${data.uid}'`
                db.query (queryUpdate, (err, result) => {
                    try {
                        if (err) throw err

                        let queryCheck = 
                        `
                            SELECT * FROM users
                            JOIN status ON status.id = users.status
                            WHERE users.uid = '${data.uid}';
                        `

                        db.query (queryCheck, (err, result) => {
                            try {
                                if (err) throw err
                                // console.log (result)

                                res.status(200).send ({
                                    uid: data.uid,
                                    status: result[0].status
                                })
                                
                            } catch (error) {
                                console.log (error)
                                res.status(500).send ({
                                    error: true,
                                    message: error.message
                                })
                            }
                        })

                        // res.status(200).send ({
                        //     uid: data.uid,
                        //     status: "active"
                        // })
                        
                    } catch (error) {
                        console.log (error)
                        res.status(500).send ({
                            error: true,
                            message: error.message
                        })
                    }
                })


            } else {
                res.status (200).send ({
                    error: true,
                    message: "Unidentified user"
                })
            }

        } catch (error) {
            console.log (error)
            res.status(500).send ({
                error: true,
                message: error.message
            })
        }
    })
}

const onCloseUser = (req, res) => {
    let data = req.dataToken
    console.log (data)

    let queryCheck = `SELECT * FROM users WHERE uid = '${data.uid}'`
    db.query (queryCheck, (err, result) => {
        try {
            if (err) throw err
            console.log (result)

            if (result.length === 1 && result[0].status === 1){
                let queryUpdate = `UPDATE users SET status = 3 WHERE uid = '${data.uid}'`
                db.query (queryUpdate, (err, result) => {
                    try {
                        if (err) throw err

                        res.status(200).send ({
                            uid: data.uid,
                            status: "closed"
                        })
                        
                    } catch (error) {
                        console.log (error)
                        res.status(500).send ({
                            error: true,
                            message: error.message
                        })
                    }
                })


            } else {
                res.status (200).send ({
                    error: true,
                    message: "Unidentified user"
                })
            }

        } catch (error) {
            console.log (error)
            res.status(500).send ({
                error: true,
                message: error.message
            })
        }
    })
}

module.exports = {
    onRegisterUser,
    onLoginUser,
    onDeactivateUser,
    onActivateUser,
    onCloseUser
}