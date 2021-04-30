const express =require("express")
const Router = express.Router()

// Import jwtToken
const jwtVerify = require ("../middlewares/jwtVerify")

// Import Controller
const movieController = require ("../controllers/MovieController")

Router.get ("/get/all", movieController.onGetAllMovies)
Router.post ("/get", movieController.onGetMovie)
// Router.get ("/get?status&location&time", movieController.onGetMovie)

Router.post ("/add", jwtVerify,movieController.onAddMovie)
Router.patch ("/edit/:id", jwtVerify,movieController.onEditMovie)
Router.patch ("/set/:id", jwtVerify,movieController.onAddSchedule)

module.exports = Router
