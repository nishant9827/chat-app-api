const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
// const authenticate = require('../middleware/authenticate');

// route.get('/:id',userController.createUser);
route.post('/register',userController.createUser);
route.post('/login',userController.loginUser);
route.post('/setAvatar/:id',userController.setAvatar);
route.get('/allUsers/:id',userController.getAllUsers);
route.post('/logout',authenticate,userController.logoutUser);

module.exports = route;