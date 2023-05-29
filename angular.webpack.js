const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');

module.exports = (config, options) => {
    config.target = 'electron-renderer';

    if (options.fileReplacements) {
        for (let fileReplacement of options.fileReplacements) {
            if (fileReplacement.replace !== 'src/environments/environment.ts') {
                continue;
            }

            let fileReplacementParts = fileReplacement['with'].split('.');
            if (fileReplacementParts.length > 1 && ['web'].indexOf(fileReplacementParts[1]) >= 0) {
                config.target = 'web';
            }
            break;
        }
    }

    config.plugins = [
        ...config.plugins,
        new NodePolyfillPlugin({
            excludeAliases: ['console']
        })
    ];

    // Add PostCSS configuration
    config.module.rules.push({
        test: /\.scss$/,
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                ident: 'postcss',
                syntax: 'postcss-scss',
                plugins: () => [postcssImport, tailwindcss('./tailwind.config.js'), autoprefixer]
            }
        }
    });

    return config;
};
