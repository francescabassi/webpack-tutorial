# WEBPACK TUTORIAL - STEP 3 - Webpack Development Server and Source Maps

This step introduces the Webpack Dev Server and the Source Maps option.

## Setup

To start clone this project:

This is a step by step tutorial to show how set up a React project using Webpack.

```
git clone --branch 3_step https://github.com/francescabassi/webpack-tutorial.git
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

Then build the project:

```
npm run build
```

You can see the result open in your browser the http://localhost:8080/ url.

## Tutorial

A good first step towards a better development environment would be to use Webpack in its watch mode. You can activate it through webpack `--watch`. Once enabled, it will detect changes made to your files and recompiles automatically.

A solution known as _webpack-dev-server_ builds on top of the watch mode and goes even further.

It is a small node.js expressapp that serves static files and builds your assets according to your webpack configuration, keeping them in memory, and doing so automatically refreshing the browser as you change your source files.

It also supports an advanced Webpack feature known as Hot Module Replacement (HMR), which provides a way to patch the browser state without a full refresh. This is particularly powerful with technology such as React. We discuss about this interesting feature further.

webpack-dev-server is a separate npm module that should be installed as a project dependency:

```
npm install --save-dev webpack-dev-server
```

The webpack dev server can be configured in the same `webpack.config.js` configuration file, in a separate
`devserver` entry.

Configuration settings include:

- `contentBase`: By default, the webpack-dev-server will serve the files in the root of the project. To serve files from a different folder you need to configure a specific content base.
- `port`: Which port to use. If omitted, defaults to "8080".
- `inline`: Set to "true" to insert a small client entry to the bundle to refresh the page on change.
- `historyApiFallback`: Useful during the development of single page applications that make use of the HTML5 history API. When set to "true", all requests to the webpack-dev-server that do not map to an existing asset will instead by routed straight to /, that is, the index.html file.
- `open`: opens the url in default browser.

**webpack.config.js**

```javascript
...
const config = {
  ...
  devServer: {
    contentBase: "./dist",
    historyApiFallback: true,
    inline: true,
    open: true
  }
}
...
```

Instead of running the `webpack` command, now you will execute the `webpack-dev-server` to start the server:

```
webpack-dev-server --progress --colors
```

The `--progress` parameter is only available in the command line. It shows a progress indicator in the terminal during the build step. `--colors` add some colors to the output.

To integrate webpack-dev-server to our project, we can define a new command to the scripts section of `package.json`:

**package.json**

```json
...
"scripts": {
  "start": "webpack-dev-server --progress --colors",
  "build": "webpack"
}
...
```

After you run the `npm start` command, should open http://localhost:8080/ at your browser and you should see something.

---

While packing together all of your project's JavaScript modules into one (or a few) bundled file to use on the browser presents a lot of advantages, one clear disadvantage is that you won't be able to reference back your original code in their original files when debugging in the browser. It becomes very challenging to locate exactly where the code you are trying to debug maps to your original authored code. However, Webpack can generate source maps when bundling. A source map provides a way of mapping code within a bundled file back to its original source file, making the code readable and easier to debug in the browser.

Webpack can generate both inline sourcemaps included within bundles or separate sourcemap files. The former is useful during development due to better performance while the latter is handy for production usage as it will keep the bundle size small.

Webpack provides seven different ways to produce a source map:

- `eval`: Each module is executed with eval and //@ sourceURL.
- `cheap-eval-source-map`: Each module is executed with eval and a sourcemap is added as a dataurl to the eval.
- `cheap-module-eval-source-map`: The fastest way to generate a source map during build. The generated source map will be inlined with the same bundled JavaScript file, without column-mappings. As in the previous option, there are drawbacks in JavaScript execution time, so this option is not appropriate for generating production-ready bundles.
- `eval-source-map`: Bundles the source code modules using "eval", with nested, complete source map in the same file. This option does generate a full featured source map without a big impact on build time, but with performance and security drawbacks in the JavaScript execution. While it's a good option for using during development, this option should never be used in production.
- `cheap-source-map`: Generated sourcemaps don't have column mappings. Sourcemaps from loaders are not used.
- `cheap-module-source-map`: The fastest way to generate a source map during build. The generated source map will be inlined with the same bundled JavaScript file, without column-mappings. There are drawbacks in JavaScript execution time, so this option is not appropriate for generating production-ready bundles.
- `source-map`: Generate a complete, full featured source map in a separate file. This option has the best quality of source map, but it does slow down the build process.

According to [this post], that compares all the seven methods:

- `cheap-module-source-map` is the best option for **production** because both `bundle.js` and `bundle.js.map` are smallest and the correct file name and line number are provided.
- `cheap-module-eval-source-map` is the best option for **development** because it is the smallest option that shows the correct line number.

**webpack.config.js**

```javascript
...
const config = {
  devtool: 'cheap-module-eval-source-map',
  ...
}
...
```
## Sources
- [SurviveJS]
- [Pro React]
- [CHENG'S BLOG - Webpack devtool source map]

[SurviveJS]: <http://survivejs.com/webpack/introduction/>
[Pro React]: <http://www.pro-react.com/materials/appendixA/>
[this post]: <http://cheng.logdown.com/posts/2016/03/25/679045>
[CHENG'S BLOG - Webpack devtool source map]: <http://cheng.logdown.com/posts/2016/03/25/679045>
