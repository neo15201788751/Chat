var User = function (id, online, name, password) {
    this.id = id || '';//socketId
    this.online = online || false;
    this.name = name || '';
    this.password = password || '';
};

module.exports = function (id, online, name, password) { return new User(id, online, name, password); };