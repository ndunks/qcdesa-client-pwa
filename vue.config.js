/**
 * Add proxy request to API Server
 */

module.exports = {
    devServer: {
        proxy: {
            '/api/': {
                target: 'http://localhost:8888/'
            },
            '/public/': {
                target: 'http://localhost:8888/'
            },
            '/api/voter': {
                target: 'http://localhost:8888/',
                ws: true
            }
        }
    }
}