var createUser = require('../model/user');
var userDic = {};
var LoginUser = function () { };
LoginUser.prototype.userOffline = function (id) {
    /// <summary>
    /// offline user 
    /// </summary>
    /// <param name="id">the socketId of user.</param>
    /// <returns type="Boolean">when success return true,else false</returns>
    for (var key in userDic) {
        if (userDic.hasOwnProperty(key)) {
            if (userDic[key].id === id) {
                userDic[key].id = '';
                userDic[key].online = false;
                return true;
            }
        }
    }
    return false;
};
LoginUser.prototype.getOnlineUser = function () {
    var onlineUsers = [];
    for (var key in userDic) {
        if (userDic.hasOwnProperty(key)) {
            if (userDic[key].online) {
                onlineUsers.push(userDic[key]);
            }
        }
    }
    return onlineUsers;
};
LoginUser.prototype.getOnlineUserById = function (id) {
    for (var key in userDic) {
        if (userDic.hasOwnProperty(key)) {
            if (userDic[key].online && userDic[key].id === id) {
                return userDic[key];
            }
        }
    }
    return null;
};
LoginUser.prototype.login = function (req, res, socket) {
    var user = req.body;
    if (!user || !user.name || !user.password) {
        res.status(400).send('username or password is not valid!');
    } else {
        if (user.name in userDic) {
            if (user.password === userDic[user.name].password) {
                if (!userDic[user.name].online) {
                    userDic[user.name].online = true;
                    socket.emit('user login', {
                        name: user.name,
                        id: user.id
                    });
                } else {
                    socket.to(userDic[user.name].id).emit('force offline');
                }

                userDic[user.name].id = user.id;
                res.json({
                    success: true,
                    currentUser: this.getOnlineUser()
                });
            } else {
                res.status(401).send('username or password error!');
            }
        } else {
            userDic[user.name] = createUser(user.id, true, user.name, user.password);
            socket.emit('user login', {
                name: user.name,
                id: user.id
            });
            res.json({
                success: true,
                currentUser: this.getOnlineUser()
            });
        }
    }
};
module.exports = new LoginUser();