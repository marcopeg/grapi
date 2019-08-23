const path = require('path')

const rootPath = process.cwd()
const basePath = path.join(rootPath, 'design')

const SD = require('style-dictionary').extend({
    source: [path.join(basePath, 'properties', '**', '*.json')],
    platforms: {
        scss: {
            transformGroup: 'scss',
            buildPath: path.join(rootPath, 'src', '/'),
            files: [{
                destination: '_variables.scss',
                format: 'scss/variables',
            }],
        },
        javascript: {
            transformGroup: 'js',
            buildPath: path.join(rootPath, 'src', '/'),
            files: [{
                destination: '_variables.js',
                format: 'javascript/es6',
            }],
        },
    },
})

SD.buildAllPlatforms()
