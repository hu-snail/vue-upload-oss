const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
const WebpackBar = require('webpackbar')
const { version } = require('./package.json')

module.exports = {
    publicPath: './',
    configureWebpack() {
        return {
            resolve: {
                alias: {
                '@': resolve('src'),
                },
            },
            plugins: [
                new WebpackBar({
                    name: 'vue-upload-oss',
                }),
            ]
        }
    },
    css: {
        extract: {
          filename: `static/css/[name].css?v=` + version,
        },
        sourceMap: true,
        modules: false,
        loaderOptions: {
          scss: {
            /*sass-loader 8.0语法 */
            //prependData: '@import "~@/styles/variables.scss";',
    
            /*sass-loader 9.0写法，感谢github用户 shaonialife*/
            additionalData(content, loaderContext) {
              const { resourcePath, rootContext } = loaderContext
              const relativePath = path.relative(rootContext, resourcePath)
              if (
                relativePath.replace(/\\/g, '/') !== 'src/styles/variables.scss'
              ) {
                return '@import "~@/styles/variables.scss";' + content
              }
              return content
            },
          },
        },
    }
}
