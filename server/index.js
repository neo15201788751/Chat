/*global __dirname,require*/
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');
var port = 3000;
var loginUser = require('./userManagement/loginUser');

var projectDir = express.static(path.join(__dirname, '/../client'));
app.use(projectDir);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// get an instance of the express Router
var router = express.Router();

router.route('/login')
	//(accessed at POST http://localhost:3000/api/login)
	.post(function (req, res) {
        loginUser.login(req, res, io);
    });

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function (req, res) {
    res.json({
        message: 'chat api!'
    });
});

// all of our routes will be prefixed with /api
app.use('/api', router);

app.get('/', function (req, res) {
    // ReSharper disable once UseOfImplicitGlobalInFunctionScope
    res.sendFile(path.join(__dirname, '/../client/app/index.html'));
});

io.on('connection', function (socket) {
    socket.on('chat message', function (msgObj) {
        var toUser = loginUser.getOnlineUserById(msgObj.to.id);
        if (toUser) {
            io.to(toUser.id).emit('chat message', msgObj);
        }
    });
    socket.on('disconnect', function () {
        var result = loginUser.userOffline(this.id);
        if (result) {
            io.emit('user offline', this.id);
        }
    });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
    console.log('open chrome,and visit localhost:' + port);
});
