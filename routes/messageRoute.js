const express = require('express');
const route = express.Router();
const {addMessage,getAllMessage} = require('../controllers/messagesController');
const authenticate = require('../middleware/authenticate');
// const authenticate = require('../middleware/authenticate');

// route.get('/:id',userController.createUser);
route.post('/addmsg',addMessage);
route.post('/getmsg',getAllMessage);

module.exports = route;