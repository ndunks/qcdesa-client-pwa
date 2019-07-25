/**
 * Add proxy request to API Server
 */

module.exports = {
    devServer: {
        proxy: {

            '^/api/': {
                target: 'http://localhost:8888/',
                ws: true
            },
            '^/public/': {
                target: 'http://localhost:8888/'
            },
        }
    }
}