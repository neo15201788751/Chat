/* jshint undef: true, unused: true */
/* globals seajs*/

// seajs 的简单配置
seajs.config({
    base: '.',
    alias: {
        'jquery': 'app/lib/jquery/js/jquery.js',
        'socket': '/socket.io/socket.io.js',
        'commonElements': 'app/commonElements.js',
        'messager': 'app/messager.js'
    }
});

// 加载入口模块
seajs.use('app/main.js');