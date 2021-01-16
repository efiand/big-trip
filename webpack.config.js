const path = require(`path`);
const publicPath = path.resolve(__dirname, `public`);

module.exports = {
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: publicPath,
  },
  devtool: `source-map`,
  devServer: {
    contentBase: publicPath,
    watchContentBase: true
  },
  module: {
    rules: [
        {
            test: /\.css$/i,
            use: [`style-loader`, `css-loader`]
        }
    ]
  }
};
