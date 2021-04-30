const express = require ("express")
const Router = express.Router()

// Import jwtToken
const jwtVerify = require ("../middlewares/jwtVerify")

// Import Controller
const userController = require ("../controllers/UserController")

Router.post ("/register", userController.onRegisterUser)
Router.post ("/login", userController.onLoginUser)

Router.patch ("/deactivate", jwtVerify, userController.onDeactivateUser)
Router.patch ("/activate", jwtVerify, userController.onActivateUser)
Router.patch ("/close", jwtVerify, userController.onCloseUser)


module.exports = Router
