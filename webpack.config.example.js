module.exports = {
  
  entry: {
      main :'./resources/assets/js/main-webpack.js'
  }
  ,
  
  output: {
    filename: "entrypoint.js",
    path: __dirname + "/js/"
  },
  
  module : {
  
    loaders: [
      {
        test: /\.js(x?)$/, loader: 'babel-loader' ,
        exclude:  /(node_modules|vendor)/,
        query: {
            plugins: [ "transform-decorators-legacy", 'transform-class-properties', 'transform-runtime'],
            presets: [ 'es2015' , 'stage-0' ]
        }
      }
    ]
    
  },
  
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.css', '.scss', '.sass'],
  }
  
};