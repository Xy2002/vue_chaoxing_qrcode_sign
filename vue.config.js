module.exports = {
    devServer: {
        port: '8081', // 设置端口号
        proxy: {
            '/api': {
                target: 'http://107.175.61.151:9090/', //API服务器的地址
                ws: false, //代理websockets
                changeOrigin: false, // 是否跨域，虚拟的站点需要更管origin
                pathRewrite: {
                    // '^/api'是一个正则表达式，表示要匹配请求的url中，全部'http://localhost:8081/api' 转接为 http://localhost:8081/
                    '^/api': '',
                }
            }
        },
    }
}
