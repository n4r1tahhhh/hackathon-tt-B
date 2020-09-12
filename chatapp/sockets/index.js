'use strict';

module.exports = function (server) {

    const socketIo = require('socket.io')(server, { wsEngine: 'ws' });
    const io = socketIo.listen(server);
    const xssFilters = require('xss-filters');

    io.sockets.on('connection', function (socket) {
        // 投稿モジュールの呼出
        require('./publish')(socket, io, xssFilters);

        // 入室モジュールの呼出
        require('./enter')(socket, xssFilters);

        // 退室モジュールの呼出
        require('./exit')(socket, xssFilters);
    });
};
