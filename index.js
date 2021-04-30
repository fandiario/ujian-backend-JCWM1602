const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')

// main app
const app = express()

// apply middleware
app.use(cors())
app.use (express.json())
// app.use(bodyparser.json())

// import router
const userRouter = require ("./routers/UserRouter")
const movieRouter = require ("./routers/MovieRouter")

// main route
const response = (req, res) => res.status(200).send(
    '<h1>REST API JCWM1602. <a href="https://documenter.getpostman.com/view/12546623/TzRLjVFT">READ ME !</a></h1>')
app.get('/', response)

// route
app.use ("/user", userRouter)
app.use ("/movies", movieRouter)


// bind to local machine
const PORT = process.env.PORT || 2000
// app.listen (PORT, () => console.log (`CONNECTED: port ${PORT}`))
app.listen(PORT, () => `CONNECTED : port ${PORT}`)