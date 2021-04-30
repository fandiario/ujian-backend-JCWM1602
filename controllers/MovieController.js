const db = require ("../connection/Connection")

const onGetAllMovies = (req, res) => {
    let queryGet = `SELECT * FROM movies`
    db.query (queryGet, (err, result) => {
        try {
            if (err) throw err
            // console.log (result)

            res.status(200).send ({
                result
            })
            
        } catch (error) {
            console.log (error)
            res.status(500).send ({
                error: true,
                message: error.message
            })
        }
    })
}

const onGetMovie = (req, res) => {
    // let data = req.params
    // console.log (req.params)
    // console.log (data)
    let data = req.body 
    let status = data.status
    let location = data.location
    let time = data.time

    let querySelect = 
    `
    SELECT * FROM movies
    JOIN movie_status ON movie_status.id = movies.status
    JOIN schedules ON movie_id = movies.id
    JOIN locations ON locations.id = schedules.location_id
    JOIN show_times ON show_times.id = schedules.time_id
    WHERE movie_status.status = '${status}' AND location = '${location}' AND time = '${time}';
    `

    db.query (querySelect, (err, result) => {
        try {
            if (err) throw err

            res.status (200).send ({
                result
            })

        } catch (error) {
            console.log (error)
            res.status(500).send ({
                error: true,
                message: error.message
            }) 
        }
    })
}

// const onGetMovie = (req, res) => {
//     // console.log (req.query)
//     let data = req.query

//     let status = data.status
//     let location = data.location
//     let time = data.time

//     console.log (data)

//     let querySelect = 
//     `
//     SELECT * FROM movies
//     JOIN movie_status ON movie_status.id = movies.status
//     JOIN schedules ON movie_id = movies.id
//     JOIN locations ON locations.id = schedules.location_id
//     JOIN show_times ON show_times.id = schedules.time_id
//     WHERE movie_status.status = '${status}' AND location = '${location}' AND time = '${time}';
//     `

//     db.query (querySelect, (err, result) => {
//         try {
//             if (err) throw err

//             res.status (200).send ({
//                 result
//             })

//         } catch (error) {
//             console.log (error)
//             res.status(500).send ({
//                 error: true,
//                 message: error.message
//             }) 
//         }
//     })
// }

const onAddMovie = (req, res) => {
    let data = req.dataToken
    // console.log (data)

    try {
        if (data.role !==1) throw ({message: "Unauthorized Account"})

        let dataToInsert = {
            name: req.body.name,
            genre: req.body.genre,
            release_date: req.body.release_date,
            release_month: req.body.release_month,
            release_year: req.body.release_year,
            duration_min: req.body.duration_min,
            description: req.body.description,
            status: 1
        }

        let queryInsert = `INSERT INTO movies SET ?`
        db.query (queryInsert, dataToInsert,(err, result) => {
            try {
                if (err) throw err

                res.status(200).send ({
                    id: result.insertId,
                    name: req.body.name,
                    genre: req.body.genre,
                    release_date: req.body.release_date,
                    release_month: req.body.release_month,
                    release_year: req.body.release_year,
                    duration_min: req.body.duration_min,
                    description: req.body.description 
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
        res.status(401).send ({
            error: true,
            message: error.message
        }) 
    }
    
}

const onEditMovie = (req, res) => {
    let data = req.dataToken
    // console.log (data)

    try {
        if (data.role !==1) throw ({message: "Unauthorized Account"})

        let dataParams = req.params
        let idMovie = dataParams.id
        // console.log (dataParams)

        querySelect = `SELECT * FROM movies WHERE id = ${idMovie}`
        db.query (querySelect, (err, result) => {
            try {
                if (err) throw err

                // console.log (result)
                if (result.length === 1) {
                    let dataBody = req.body
                    let statusMovie = dataBody.status

                    let quaryUpdate = `UPDATE movies SET status = ${statusMovie} WHERE id = ${idMovie}`
                    db.query (quaryUpdate, (err, result) => {
                        try {
                            if (err) throw err

                            res.status (200).send ({
                                id: idMovie,
                                message: "Status has been changed"
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
                        message: "Movie is not found"
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
        res.status(401).send ({
            error: true,
            message: error.message
        }) 
    }
}

const onAddSchedule = (req, res) => {
    let data = req.dataToken

    try {
        if (data.role !==1) throw ({message: "Unauthorized Account"})
        let dataParams = req.params
        let idMovie = dataParams.id

        querySelect = `SELECT * FROM movies WHERE id = ${idMovie}`
        db.query (querySelect, (err, result) => {
            try {
                if (err) throw err

                // console.log (result)
                if (result.length === 1) {
                    let dataBody = req.body
                    
                    let dataToSend = {
                        movie_id: idMovie,
                        location_id: dataBody.location_id,
                        time_id: dataBody.time_id
                    }

                    let queryUpdate = `INSERT INTO schedules SET ?`
                    db.query (queryUpdate, dataToSend, (err, result) => {
                        try {
                            if (err) throw err

                            res.status(200).send ({
                                id: idMovie,
                                message: "Schedule has been added"
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
                        message: "Movie is not found"
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
        res.status(401).send ({
            error: true,
            message: error.message
        }) 
    }
}

module.exports = {
    onGetAllMovies,
    onGetMovie,
    onAddMovie,
    onEditMovie,
    onAddSchedule
}