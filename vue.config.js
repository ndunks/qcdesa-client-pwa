/**
 * Add proxy request to API Server
 */

module.exports = {
    productionSourceMap: false,
    transpileDependencies: ['vuetify'],
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