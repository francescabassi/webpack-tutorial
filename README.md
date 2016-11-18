# WEBPACK TUTORIAL - STEP 8 - Building for production

In this step we see how to prepare the build release with code minification, bundle splitting, and caching..

## Setup

To start clone this project:

```
git clone --branch 8_step https://github.com/francescabassi/webpack-tutorial.git
```

## Usage

Install the dependencies:

```
npm install
```

To start the webpack-dev-server mode:

```
npm start
```

You can see the result open in your browser the [http://localhost:8080/] url.

Then build the project:

```
npm run build
```

## Tutorial

For a production-ready build, we will want some additional processing in our bundle file, including some characteristics like optimization and minification, caching and separation from css and JavaScript files.

For projects with complex setups, splitting the webpack configuration in multiple files is a good practice to keep everything more organized. In our sample project, let's create a new file named `webpack.production.config.js` and fill it with some basic setup.

**webpack.production.config.js**

```javascript
var webpack = require('webpack');

module.exports = {
  entry: __dirname + "/src/main.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.module.css$/,
        loader: 'style!css?modules'
      },
      {
        test: /^((?!\.module).)*css$/,
        loader: 'style!css'
      }
    ]
  },
}
```

It's very similar to the original Webpack development configuration (webpack.config.js), with stripped devtool, devServer and Hot Module Replacement configurations.

In sequence, edit the package.json file to create a new build task, which will run Webpack in production environment and assign the newly created configuration file:

**package.json**

```json
...
"scripts": {
  "start": "webpack-dev-server --progress --colors",
  "build": "NODE_ENV=production webpack --config ./webpack.production.config.js --progress",
  "test": "echo \"Error: no test specified\" && exit 1"
},
...
```

Webpack comes with some very useful optimization plugins for generating a production-ready build. Many others were made by the community and are available through npm.

### 1. Occurence Order Plugin

Webpack gives IDs to identify your modules. With this plugin, Webpack will analyze and prioritize often used modules assigning them the smallest ids.

**webpack.production.config.js**

```javascript
...
plugins: [
  new webpack.optimize.OccurenceOrderPlugin(),
],
...
```

### 2. UglifyJs Plugin

UglifyJS is a JavaScript compressor/minifier. Minification is a process where code is simplified without losing any meaning that matters to the interpreter. As a result your code will most likely look quite jumbled and it will be hard to read. Minification will convert our code into a smaller format without losing any meaning. Usually this means some amount of rewriting code through predefined transformations.

By default Uglify will output a lot of warnings and they don't provide value in this case, we'll be disabling them. It is possible to control all other UglifyJS features through Webpack.

**webpack.production.config.js**

```javascript
...
plugins: [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    comments: false,
    compress: {
      warnings: false,
      drop_console: true
    }
  }),
],
...
```

![Alt text][webpack_build_img]
![Alt text][webpack_build_uglify_img]

### 3. Splitting Bundles

Currently the production version of our application is a single JavaScript file. This isn't ideal. If we change the application, the client has to download vendor dependencies as well. It would be better to download only the changed portion. If the vendor dependencies change, then the client should fetch only the vendor dependencies.

This technique is known as **bundle splitting**. We can push the vendor dependencies to a bundle of its own and benefit from client level caching. We can do this in a such way that the whole size of the application remains the same.

To improve the situation, we can define a vendor entry containing all the project dependencies. If you maintain strict separation between dependencies and devDependencies, you can make Webpack to pick up your vendor dependencies automatically based on this information. You avoid having to manage those manually then.

Before see the result, we have to introduce another plugin to automate the generation of the `index.html` file so we don't have to modify it every time we introduce other entries. To do so we use the [html-webpack-plugin].

```
npm install --save-dev html-webpack-plugin
```

Now we have to create a template for the `index.html` page in which we insert a `div` with the `id` that `main.js` uses to inject the React component.

**src/index.tml.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Webpack Tutorial</title>
  </head>
  <body>
    <div id='content'>
    </div>
  </body>
</html>
```

**webpack.production.config.js**


```javascript
...
const HtmlWebpackPlugin = require('html-webpack-plugin');
...
module.exports = {
  entry: {
    main: __dirname + "/src/main.js",
    vendor: Object.keys(pkg.dependencies)
  },
  ...
  plugins: [
    ...
    new HtmlWebpackPlugin({
      template: __dirname + "/src/index.tmpl.html"
    })
  ],
}
```

We have two separate entries, or **entry chunks**, now.

![Alt text][webpack_build_vendor_img]

`main.js` and `vendor.js` have separate chunk ids right now given they are entry chunks of their own. The output size is a little off, though. `main.js` should be significantly smaller to attain our goal with this build.

If you examine the resulting bundle, you can see that it contains React given that's how the default definition works. Webpack pulls the related dependencies to a bundle by default.

A Webpack plugin known as `CommonsChunkPlugin` allows us alter this default behavior so that we can get the bundles we might expect.

**webpack.production.config.js**

```javascript
...
module.exports = {
  entry: {
    main: __dirname + "/src/main.js",
    vendor: Object.keys(pkg.dependencies)
  },
  ...
  plugins: [
    ...
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    })
  ],
}
```

Now our bundles look just the way we want.


![Alt text][webpack_build_commons_img]

### Caching: adding hashes to filenames

Modern Internet infrastructure embraces caching everywhere (At CDNs, ISPs, networking equipment, web browsers...), and one simple and effective way to leverage long-term caching in this infrastructure is making sure that your file names are unique and based on their content (that is, if the file content changes, the file name should change too). This way, remote clients can keep their own copy of the content and only request a new one when it's a different file name.

Webpack can add hashes for the bundled files to their filename, simply by adding special string combinations such as [name], [id] and [hash] to the output file name configuration.

**webpack.production.config.js**

```javascript
...
output: {
  path: __dirname + "/dist",
  filename: '[name].[chunkhash].js',
  chunkFilename: '[chunkhash].js'
},
...
```

![Alt text][webpack_build_hash_img]

### Cleaning the Build

Our current setup doesn't clean the build directory between builds. As this can get annoying if we change our setup, we can use a plugin to clean the directory for us, [clean-webpack-plugin].

```
npm i clean-webpack-plugin --save-dev
```

**webpack.production.config.js**

```javascript
...
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  ...
  plugins: [
    ...
    new CleanWebpackPlugin(["dist"], {
      root: process.cwd() // An absolute path for the root.
    })
  ],
}

```

### Separating CSS

Even though we have a nice build set up now, where did all the CSS go? As per our configuration, it has been inlined to JavaScript! Even though this can be convenient during development, it doesn't sound ideal. The current solution doesn't allow us to cache CSS. In some cases we might suffer from a Flash of Unstyled Content ([FOUC]).

We generate a separate CSS bundle using the [ExtractTextPlugin]

```
npm i extract-text-webpack-plugin --save-dev
```

The plugin operates in two parts. There's a loader, ExtractTextPlugin.extract, that marks the assets to be extracted. The plugin will perform its work based on this annotation.

**webpack.production.config.js**

```javascript
...
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  ...
  module: {
    loaders: [
      ...
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css'),
      }
    ]
  },
  plugins: [
    ...
    new ExtractTextPlugin('[name].[chunkhash].css')
  ],
}
```

Now our styling has been pushed to a separate CSS file. As a result, our JavaScript bundles have become slightly smaller. We also avoid the FOUC problem. The browser doesn't have to wait for JavaScript to load to get styling information. Instead, it can process the CSS separately avoiding the flash.

![Alt text][webpack_build_css_img]

### Other step

- Eliminating Unused CSS with [purifycss], but doesn't work with CSS modules.
- Analyzing Build Statistics with [stats]
- Hosting on GitHub Pages with [gh-pages]


## Sources
- [SurviveJS]
- [Pro React]


[SurviveJS]: <http://survivejs.com/webpack/introduction/>
[Pro React]: <http://www.pro-react.com/materials/appendixA/>
[http://localhost:8080/]: <http://localhost:8080/>
[clean-webpack-plugin]: <https://www.npmjs.com/package/clean-webpack-plugin>
[html-webpack-plugin]: <https://www.npmjs.com/package/html-webpack-plugin>
[FOUC]: <https://en.wikipedia.org/wiki/Flash_of_unstyled_content>
[ExtractTextPlugin]: <https://www.npmjs.com/package/extract-text-webpack-plugin>
[purifycss]: <https://www.npmjs.com/package/purifycss-webpack-plugin>
[stats]: <https://www.npmjs.com/package/stats-webpack-plugin>
[gh-pages]: <https://www.npmjs.com/package/gh-pages>

[webpack_build_img]: ./img/webpack_build.png "first build"
[webpack_build_uglify_img]: ./img/webpack_build_uglify.png "build with uglify"
[webpack_build_vendor_img]: ./img/webpack_build_vendor.png "build with bundle splitting"
[webpack_build_commons_img]: ./img/webpack_build_commons.png "build with commons chunk"
[webpack_build_commons_img]: ./img/webpack_build_hash.png "build with hash"
[webpack_build_css_img]: ./img/webpack_build_css.png "build with separated css"
