# WEBPACK TUTORIAL - STEP 6 - Plugins

In this step we discover the plugins, particularly the Hot Module Replacement plugin.

## Setup

To start clone this project:

```
git clone --branch 6_step https://github.com/francescabassi/webpack-tutorial.git
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

Webpack can be extended through plugins. In Webpack, plugins have the ability to inject themselves into the build process to introduce custom behaviors.

Loaders and plugins are commonly confused with each other, but they are completely different things. Roughly speaking, loaders deal with each source file, one at a time, as they are "loaded" by webpack during the build process. Plugins in the other hand do not operate on individual source files: they influence the build process as a whole.

Webpack comes with many built-in plugins, but there are lots of third party plugins available.

To use a plugin, install it using npm (if it's not built-in), import the plugin in the webpack configuration file and add an instance of the plugin object to an `plugins` array.

### Hot Module Replacement

Hot Module Replacement (or HMR for short) gives the ability to tweak your components in real time - any changes in the CSS and JS get reflected in the browser instantly without refreshing the page. In other words, the current application state persists even when you change something in the underlying code.

Enabling HMR in Webpack is simple, you will need to make two configurations:

1. Add the HotModuleReplacementPlugin to webpack's configuration.
2. Add the `hot` parameter to the Webpack Dev Server configuration.

JavaScript modules won't be automatically eligible for hot replacement. Webpack provides an API which you need to implement in your JavaScript modules in order to allow them to be hot replaceable. Although this API isn't difficult to use, there is a more practical way: using Babel.

With the use of a Babel plugin, it is possible to use Webpack to make an additional transformation and add all needed code into your React components to make them hot-replaceable. Babel has a plugin called [react-transform-hmr] that inserts the required HMR code automatically in all your React components.

**webpack.config.js**

```javascript
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
...
plugins: [
  new webpack.HotModuleReplacementPlugin()
],
devServer: {
  historyApiFallback: true,
  inline: true,
  hot: true
}
...
```

Install the required Babel plugins with npm:

```
npm install --save-dev babel-plugin-react-transform react-transform-hmr
```

**.babelrc**

```json
{
  "presets": ["react", "es2015"],
  "env": {
    "development": {
    "plugins": [["react-transform", {
       "transforms": [{
         "transform": "react-transform-hmr",
         "imports": ["react"],
         "locals": ["module"]
       }]
     }]]
    }
  }
}
```

### Others Plugin

- `bannerPlugin`: is a simple built-in plugin. Its purpose is to add any given string to the top of the generated bundle file.
- `HtmlWebpackPlugin`: is a third party webpack plugin that generates the final HTML5 file for you and include all your webpack bundles. This is especially useful for production builds, where hashes that change on every compilation are added to bundle filenames. [Here] for more information.


## Sources
- [SurviveJS]
- [Pro React]

[SurviveJS]: <http://survivejs.com/webpack/introduction/>
[Pro React]: <http://www.pro-react.com/materials/appendixA/>
[http://localhost:8080/]: <http://localhost:8080/>
[react-transform-hmr]: <https://github.com/gaearon/react-transform-hmr>
[here]: <https://github.com/ampedandwired/html-webpack-plugin>
