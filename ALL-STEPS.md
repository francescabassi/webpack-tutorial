# WEBPACK

> "In the land of JavaScript, no one is king for long."

[How it feels to learn JavaScript in 2016]

1.  [Intro](#intro)
2.  [What is webpack?](#wp)
3.  [Getting Started](#start)
4.  [Configuring webpack](#conf)
5.  [Webpack Dev Server and SourceMap](#dev)
6.  [Loaders](#loaders)
7.  [Css](#css)
8.  [Plugins](#plugins)
9.  [Linting](#linting)
10. [Building for production](#build)
11. [Create React App (?)](#create)
12. [Sources](#sources)

## <a name="intro"></a>1. INTRO ##

Today’s websites are evolving into web apps:
  - More and more JavaScript is being used.
  - Modern browsers are offering a wider range of interfaces.
  - Fewer full page reloads → even more code in a page.

As a result there is a **lot** of code on the client side!

A big code base needs to be organized. Module systems offer the option to split your code base into modules.

### 1.1 MODULE SYSTEM STYLES ###

There are multiple standards for how to define dependencies and export values

#### 1.1.1 `<script>`-tag style ####
```javascript
<script src="module1.js"></script>
<script src="module2.js"></script>
<script src="libraryA.js"></script>
<script src="module3.js"></script>
```
Common problems

- Conflicts in the global object.
- Order of loading is important.
- Developers have to resolve dependencies of modules/libraries.
- In big projects the list can get really long and difficult to manage.

#### 1.1.2 CommonJs: synchronous require ####
This style uses a synchronous require method to load a dependency and return an exported interface.
```javascript
require("module");
require("../file.js");
exports.doStuff = function() {};
module.exports = someValue;
```
Pros
- Server-side modules can be reused.
- There are already many modules written in this style (npm).
- Very simple and easy to use.

Cons
- Blocking calls do not apply well on networks. Network requests are asynchronous.
- No parallel require of multiple modules

#### 1.1.3 AMD: asynchronous require ####
An asynchronous version (and a way to define modules and exporting values)
```javascript
require(["module", "../file"], function(module, file) { /* ... */ });
define("mymodule", ["dep1", "dep2"], function(d1, d2) {
  return someExportedValue;
});
```
Pros
- Fits the asynchronous request style in networks.
- Parallel loading of multiple modules.

Cons
- Coding overhead. More difficult to read and write.
- Seems to be some kind of workaround.

#### 1.1.4 ES6 Modules ####
```javascript
import "jquery";
export function doStuff() {}
module "localModule" {}
```
Pros
- Static analysis is easy.
- Future-proof as ES standard.

Cons
- Native browser support will take time.
- Very few modules in this style.

### 1.2 TRANSFERRING ###
Modules should be executed on the client, so they must be transferred from the server to the browser.

There are two extremes when transferring modules:
- 1 request per module
- All modules in one request

Split the set of modules into multiple smaller batches (chunks).

This allows for multiple smaller, faster requests. The chunks with modules that are not required initially can be loaded on demand. This speeds up the initial load but still lets you grab more code when it will actually be used.

### 1.3 WHY ONLY JAVASCRIPT? ###
There are many other resources that need to be handled:
- stylesheets
- images
- webfonts
- html for templating
- etc.

Or translated/processed:
- coffeescript → javascript
- elm → javascript
- less stylesheets → css stylesheets
- jade templates → javascript which generates html
- i18n files → something
- etc.

### 1.4 STATIC ANALYSIS
When compiling all these modules, a static analysis tries to find its dependencies.

Traditionally this could only find simple stuff without expression, but `require("./template/" + templateName + ".jade")` is a common construct.

### 1.5 A LITTLE BIT OF HISTORY ###
Back in the day, it was enough just to concatenate some scripts together. Times have changed, though, and now distributing your JavaScript code can be a complex endeavor. This problem has escalated with the rise of single page applications (SPAs).

There have been many build systems. Make is perhaps the best known, and is still a viable option. To make things easier, specialized task runners, such as Grunt, and Gulp appeared.
Build tools such as Grunt and Gulp work by looking into a defined path for files that match your configuration. In the configuration file you also specify the tasks and steps that should run to transform, combine and/or minify each of these files.

### 1.5.1 Grunt ###

<div style="text-align:center">![alt text][grunt_img]</div>

With Grunt you would have many small tasks for various purposes, such as building the project. An important part of the power of Grunt is that it hides a lot of the wiring from you. Taken too far, this can get problematic, though. It can become hard to thoroughly understand what's going on under the hood.

### 1.5.2 Gulp ###

<div style="text-align:center">![alt text][gulp_img]</div>

Gulp builds on top of the concept of piping. You simply have sources, filters, and sinks.
Sources match to files. Filters perform operations on sources (e.g., convert to JavaScript). Finally, the results get passed to sinks (e.g., your build directory).

Compared to Grunt, you have a clearer idea of what's going on. You still end up writing a lot of boilerplate for casual tasks, though. That is where some newer approaches come in.

### 1.5.3 Browserify ###

<div style="text-align:center">![alt text][browserify_img]</div>

Dealing with JavaScript modules has always been a bit of a problem. Browserify is one solution to the module problem. It provides a way to bundle CommonJS modules together. There are smaller transformation tools that allow you to move beyond the basic usage. In Browserify you use Gulp/Grunt and a long list of transforms and plugins to get the job done.

## <a name="wp"></a>2. WHAT IS WEBPACK? ##

<div style="text-align:center">![alt text][webpack_img]</div>

We need to bundle together and transform (transpile / compile) these files into something that the browser can understand. That's where tools such as Webpack are necessary.

Webpack is a module bundler: A tool that can analyze your project's structure, find JavaScript modules and other assets to bundle and pack them for the browser.

Webpack analyzes your project as a whole. Given a starting main file, Webpack looks through all of your project's dependencies (by following require and import statements in JavaScript), processes them using loaders and generates a bundled JavaScript file.

webpack takes modules with dependencies and generates static assets representing those modules.

Goals
- Split the dependency tree into chunks loaded on demand
- Keep initial loading time low
- Every static asset should be able to be a module
- Ability to integrate 3rd-party libraries as modules
- Ability to customize nearly every part of the module bundler
- Suited for big projects

Reached By:
- **code splitting**: can be used to split code into an on demand loaded chunk. This can keep the initial download small and downloads code on demand when requested by the application.
- **loaders**: used to transform other resources into JavaScript. By doing so, every resource forms a module.
- **plugins**: allows you to customize webpack for your needs

## <a name="start"></a>3. GETTING STARTED ##

Let's create a sample project to use Webpack. Start with a new, empty folder and create a package.json file. ```-y``` generates package.json, skip for more control.

```
npm init -y
```
Add webpack as a project dependency and install it with:

```
npm i webpack --save-dev
```
Let's move on to the project structure:

![Alt text][project_structure_img]

There are two folders: an `src` folder for original source code / JavaScript modules, and a `dist` folder for files that are ready to be used in the browser (which include the bundled JavaScript file generated by Webpack, as well as an index.html file). You will create three files: an `index.html` file on the dist folder and two JavaScript files on the src folder: `main.js` and `Hello.js`.

**dist/index.html**

The `index.html` will contain a pretty basic HTML page, whose only purpose is to load the bundled JavaScript file.

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
    <script src="bundle.js"></script>
  </body>
</html>
```
The `Hello.js` is simply a function that returns a new HTML element with a hello message.

**src/Hello.js**

```javascript
module.exports = function() {
  const hello = document.createElement('div');
  hello.textContent = "Hello!";
  return hello;
};
```

The `main.js` file will insert the HTML element returned by the Hello module in the page.

**main.js**

```javascript
const hello = require('./Hello.js');
document.getElementById('content').appendChild(hello());

```

The basic command line syntax for webpack is `webpack {entry file} {destination for bundled file}`. If you don't have webpack installed globally, you will need to reference the webpack command in the node_modules folder of your project.

```
webpack src/main.js dist/bundle.js
```

You should see the following output in the terminal:

![alt text][first_build_img]

The output tells us:

- `Hash: fad8e0369a2e75a200a6`: The hash of the build. You can use this to invalidate assets through `[hash]` placeholder.
- `Version: webpack 1.13.3`: Webpack version.
- `Time: 44ms`: Time it took to execute the build.
- `bundle.js 1.69 kB 0 [emitted] main`: Name of the generated asset, size, the ids of the chunks into which it is related, status information telling how it was generated, name of the chunk.
- `[0] ./src/main.js 94 bytes {0} [built]`: The id of the generated asset, name, size, entry chunk id, the way it was generated.

If you open the `index.html` file on the browser, the result will look like this:

![alt text][first_output_img]

## <a name="conf"></a>4. CONFIGURING WEBPACK ##

Webpack has a lot of different and advanced options and allows for the usage of loaders and plugins to apply transformations on the loaded modules. Although its possible to use webpack with all options from the command line, the process tends to get slow and error-prone. A better approach is to define a configuration file - a simple JavaScript module where you can put all information relating to your build.

Create a file named `webpack.config.js`; at bare minimum, the Webpack configuration file must reference the entry file and the destination for the bundled file:

**webpack.config.js**

```javascript
module.exports = {
  entry: __dirname + "src/main.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  }
}
```

Executing a long command such as `node_modules/.bin/webpack` is boring and error prone. Thankfully, npm can be used as a task runner, hiding verbose scripts under simple commands such as `npm start`. This can be achieved easily by setting up a scripts section to `package.json`, as shown below:

**package.json**

```json
{
  "name": "webpack-tutorial",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "webpack",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^1.13.3"
  }
}
```

To make it easier to develop our configuration, we can integrate a _tool_ known as [webpack-validator] to our project. It will validate the configuration against a schema and warn if we are trying to do something not sensible. This takes some pain out of learning and using Webpack.

```
npm i webpack-validator --save-dev
```

**webpack.config.js**

```javascript
const validate = require('webpack-validator');

const config = {
  entry: __dirname + "/src/main.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  }
}

module.exports = validate(config);
```

Now you can build the project with this command:

```
npm start
```  

The result will be the same as the previous step.

## <a name="dev"></a>5. WEBPACK DEV SERVER and SOURCE MAP ##

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

After you run the `npm start` command, should open [http://localhost:8080/] at your browser and you should see something.

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

## <a name="loaders"></a>6. LOADERS ##

Through the use of loaders, webpack can preprocess the source files through external scripts and tools as it loads them to apply all kinds of changes and transformations.

Loaders need to be installed separately and should be configured under the `modules` key in `webpack.config.js`. Loader configuration setting include:

- `test`: a regular expression that matches the file extensions that should run through this loader (**required**).
- `loader`: the name of the loader (**required**).
- `include / exclude`: optional setting to manually set which folders and files the loader should explicitly add or ignore.
- `query`: the query setting can be used to pass additional options to the loader.

Webpack's loaders are always evaluated from right to left and from bottom to top (separate definitions).

We see the use of loaders when we use React. Facebook's React is a popular alternative for developing web applications. Most React setups rely on a transpiler known as Babel. Most of the React code out there relies on a format known as JSX. It is a superset of JavaScript that allows you to mix XMLish syntax with JavaScript. Babel allows us to use JSX with React easily.

First, install babel:

```
npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react
```

**webpack.config.js**

```javascript
...
module: {
  loaders: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }
  ]
},
...
```

Babel can be entirely configured within `webpack.config.js`, but since it has many configuration settings we opt to create a separate babel resource configuration - a `.babelrc` file.

**.babelrc**

```json
{
  "presets": ["react", "es2015"]
}
```

Now that your webpack configuration makes it possible to use ES6 modules and syntax, as well as JSX, let's install React and React-DOM:

```
npm install --save react react-dom
```

Let's refactor the sample project to make use of these features.

**src/Hello.js**
```javascript
import React, {Component} from 'react'

class Hello extends Component{
  render() {
    return (
      <div>
        Hello!
      </div>
    );
  }
}

export default Hello
```

**src/main.js**

```javascript
import React from 'react';
import {render} from 'react-dom';
import Hello from './Hello';

render(<Hello />, document.getElementById('content'));
```

## <a name="css"></a>7. CSS ##

One of Webpack's most unique characteristics is that it can treat every kind of file as a module, not only your JavaScript code, but also CSS, fonts, with the appropriate loaders, all can be treated as modules. Webpack can follow @import and URL values in CSS through all dependency three and then build, preprocess and bundle your assets.

Webpack provides two loaders to deal with stylesheets: css-loader and style-loader. While the css-loader looks for @import and url statements and resolves them, the style-loader adds all the computed style rules into the page. Combined together, these loaders enable you to embed stylesheets into a Webpack JavaScript bundle.

Start by installing both css-loader and style-loader with npm:

```
npm install --save-dev style-loader css-loader
```

In sequence, update the webpack configuration file:

**webpack.config.js**

```javascript
...
module: {
  loaders: [
    ...
    {
      test: /\.css$/,
      loader: 'style!css'
    }
  ]
},
...
```

The exclamation point ("!") can be used in a loader configuration to chain different loaders to the same file types.

**src/main.css**

```css
body {
  background: #EDEDED;
}
```

Finally, remember that Webpack starts on an entry file defined in the configuration file and build all the dependency three by following statements like import, require, url among others. This means that your main CSS file must also be imported somewhere in the application in order for webpack to "find" it.

In the sample project, let's import the `main.css` from the `main.js` entry point:

**src/main.js**

```javascript
import React from 'react';
import {render} from 'react-dom';
import Hello from './Hello';
import './main.css';

render(<Hello />, document.getElementById('content'));
```

### CSS Modules

Modules let the developer break the code down into small, clean and independent units with explicitly declared dependencies.
A recent project called [CSS modules] aim to bring all these advantages to CSS. With CSS modules, all class names and are scoped locally by default. Webpack embraced the CSS modules proposal from the very beginning, it's built in the CSS loader - all you have to do is activate it by passing the `modules` query string. With this feature enabled, you will be able to export class names from CSS into the consuming component code, locally scoped (so you don't need to worry about having many classes with the same name across different components).

**webpack.config.js**

```javascript
...
module: {
  loaders: [
    ...
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
...
```
**src/hello.module.css**

```css
.root {
  color: #AA1C0D;
  padding: 10px;
  font-size: 15px;
}

```
**src/Hello.js**

```javascript
import React, {Component} from 'react';
import styles from './hello.module.css';

class Hello extends Component{
  render() {
    return (
      <div className={styles.root}>
        Hello!
      </div>
    );
  }
}

export default Hello;
```
Notice in the code above how the css classes were imported into a variable (styles) and are individually applied to a JSX element.

Also notice that any other component with it's own separate CSS module can also use the same class names without interference: even highly common style names such as "root", "header", "footer", just to name a few, can now be used safely in local scope.

### Other useful loaders

- `json-loader`
- `url-loader`
- `file-loader`
- `less-loader`
- `sass-loader`

## <a name="plugins"></a>8. PLUGINS ##

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

## <a name="linting"></a>9. LINTING ##

Nothing is easier than making mistakes when coding in JavaScript. Linting is one of those techniques that can help you to make less mistakes. You can spot issues before they become actual problems.

[ESLint] is the newest tool in vogue. ESLint goes to the next level as it allows you to implement custom rules, parsers, and reporters. ESLint works with Babel and JSX syntax making it ideal for React projects. The project rules have been documented well and you have full control over their severity.

Besides linting for issues, it can be useful to manage the code style: stylistically consistent code reads better and is easier to work with. Linting tools allow you to do this.

Let’s get started by installing the [eslint] package.

```
npm --save-dev install eslint
```

We have to tell Webpack that we want to use eslint in our build. Therefore we can install [eslint-loader].

```
npm --save-dev install eslint-loader
```

Now we can use the loader in our Webpack configuration, before the babel loader, in the preLoaders field.

**webpack.config.js**

```javascript
...
module: {
  preLoaders: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    },
  ],
  loaders: [
    ...
  ]
},
...
```

Additionally we have to use babel-eslint to lint all valid ES6 code.

```
npm install --save-dev babel-eslint
```

Let’s add some code style checking for React. Therefore we need to add the [eslint-plugin-react].

```
npm --save-dev install eslint-plugin-react
```

Now we have to set up the .eslintrc file:

**.eslintrc**

```json
{
  "parser": "babel-eslint",
  "plugins": [
    "react"
  ],
  "rules": {
  }
}
```

After that, let’s require the file in our Webpack configuration.

**webpack.config.js**

```javascript
...
eslint: {
  configFile: './.eslintrc'
},
...
```

We can either specify our rules within the webpack configuration or follow a best practice to have a dedicated file for the rules.
Since we don’t want to specify our own rule set every time, there are plenty of best practices rules out there. One of them is the [Airbnb Style Guide]. Moreover Airbnb open sourced its own [ESLint configuration].

```
npm --save-dev install eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y
```

Now we can add a one-liner to our ESLint configuration to use Airbnbs’ ESLint configuration.
Also we add all the rules, environment and ecma features that we need.

**.eslintrc**

```json
{
  "parser": "babel-eslint",
  "extends": "airbnb",
  "plugins": [
    "react"
  ],
  "ecmaFeatures": {
    "modules": true,
    "jsx": true
  },
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "quotes": [2, "single"],
    "react/prefer-stateless-function": [0, { "ignorePureComponents": true }],
  }
}

```

Now we are ready to fix all the ESLint errors in our code base!
You can either fix the error in the mentioned file or disable the rule, when you think you don’t need it.

The severity of an individual rule is defined by a number as follows:

- 0 - The rule has been disabled.
- 1 - The rule will emit a warning.
- 2 - The rule will emit an error.

But rather than disabling it globally, you can also do it for a specific line in your codebase.
For example:

```
/*eslint-disable no-unused-vars*/
import SC from 'soundcloud';
/*eslint-enable no-unused-vars*/
import React from 'react';
import ReactDOM from ‘react-dom';
...
```

## <a name="build"></a>10. BUILDING FOR PRODUCTION ##

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

## <a name="create"></a>11. CREATE REACT APP ##

[Create React App] is a new officially supported way to create single-page React applications. It offers a modern build setup with no configuration.

Let's install the global package:

```
npm install -g create-react-app
```

Now we can create a new app:

```
create-react-app hello-world
```

Once it’s done, we will see a list of commands we can run in the created folder.

![Alt text][webpack_create_list_img]

Run `npm start` to launch the development server. The browser will open automatically with the created app’s URL.

![Alt text][webpack_create_start_img]

Create React App uses both Webpack and Babel under the hood.
ESLint is also integrated so lint warnings are displayed right in the console.

To build an optimized bundle, run `npm run build`.
It is minified, correctly envified, and the assets include content hashes for caching.

![Alt text][webpack_create_build_img]

The `package.json` contains only a single build dependency and a few scripts.

**package.json**

```json
{
  "name": "hello-world",
  "version": "0.1.0",
  "private": true,
  "devDependencies": {
    "react-scripts": "0.7.0"
  },
  "dependencies": {
    "react": "^15.4.0",
    "react-dom": "^15.4.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

There are no configuration files or complicated folder structures. The tool only generates the files we need to build our app.

![Alt text][webpack_create_structure_img]

“Ejecting” lets us leave Create React App setup at any time and customize everything we want. This lets us use Create React App as a boilerplate generator.

## <a name="sources"></a>12. Sources ##
- [Webpack]
- [SurviveJS]
- [Pro React]
- [CHENG'S BLOG - Webpack devtool source map]
- [ESLint in React + Babel + Webpack]
- [Create Apps with No Configuration]

[How it feels to learn JavaScript in 2016]: <https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f#.82gafv2b4>
[Webpack]: <https://webpack.github.io/>
[SurviveJS]: <http://survivejs.com/webpack/introduction/>
[Pro React]: <http://www.pro-react.com/materials/appendixA/>
[webpack-validator]: <https://www.npmjs.com/package/webpack-validator>
[this post]: <http://cheng.logdown.com/posts/2016/03/25/679045>
[CHENG'S BLOG - Webpack devtool source map]: <http://cheng.logdown.com/posts/2016/03/25/679045>
[webpack-validator]: <https://www.npmjs.com/package/webpack-validator>
[http://localhost:8080/]: <http://localhost:8080/>
[this post]: <http://cheng.logdown.com/posts/2016/03/25/679045>
[CSS modules]: <https://github.com/css-modules/css-modules>
[react-transform-hmr]: <https://github.com/gaearon/react-transform-hmr>
[here]: <https://github.com/ampedandwired/html-webpack-plugin>
[ESLint]: <http://eslint.org/>
[eslint]: <https://github.com/eslint/eslint>
[eslint-loader]: <https://github.com/MoOx/eslint-loader>
[eslint-plugin-react]: <https://github.com/yannickcr/eslint-plugin-react>
[Airbnb Style Guide]: <https://github.com/airbnb/javascript>
[ESLint configuration]: <https://www.npmjs.com/package/eslint-config-airbnb>
[ESLint in React + Babel + Webpack]: <https://medium.com/@tkssharma/eslint-in-react-babel-webpack-9cb1c4e86f4e#.d9llmp5pb>
[clean-webpack-plugin]: <https://www.npmjs.com/package/clean-webpack-plugin>
[html-webpack-plugin]: <https://www.npmjs.com/package/html-webpack-plugin>
[FOUC]: <https://en.wikipedia.org/wiki/Flash_of_unstyled_content>
[ExtractTextPlugin]: <https://www.npmjs.com/package/extract-text-webpack-plugin>
[purifycss]: <https://www.npmjs.com/package/purifycss-webpack-plugin>
[stats]: <https://www.npmjs.com/package/stats-webpack-plugin>
[gh-pages]: <https://www.npmjs.com/package/gh-pages>
[Create Apps with No Configuration]: <https://facebook.github.io/react/blog/2016/07/22/create-apps-with-no-configuration.html>
[Create React App]: <https://github.com/facebookincubator/create-react-app>

[webpack_img]: https://webpack.github.io/assets/what-is-webpack.png "webpack logo"
[grunt_img]: http://survivejs.com/webpack/images/grunt.png "grunt logo"
[gulp_img]: http://survivejs.com/webpack/images/gulp.png "gulp logo"
[browserify_img]: http://survivejs.com/webpack/images/browserify.png "browserify logo"
[project_structure_img]: ./img/webpack_project_structure.png "project structure"
[first_build_img]: ./img/webpack_first_build.png "first build"
[first_output_img]: ./img/webpack_first_output.png "first output"
[webpack_build_img]: ./img/webpack_build.png "first build"
[webpack_build_uglify_img]: ./img/webpack_build_uglify.png "build with uglify"
[webpack_build_vendor_img]: ./img/webpack_build_vendor.png "build with bundle splitting"
[webpack_build_commons_img]: ./img/webpack_build_commons.png "build with commons chunk"
[webpack_build_commons_img]: ./img/webpack_build_hash.png "build with hash"
[webpack_build_css_img]: ./img/webpack_build_css.png "build with separated css"
[webpack_create_list_img]: ./img/webpack_create_list.png "Create React Apps: command list"
[webpack_create_start_img]: ./img/webpack_create_start.png "Create React App: start"
[webpack_create_structure_img]: ./img/webpack_create_structure.png "Create React App: structure"
[webpack_create_build_img]: ./img/webpack_create_build.png "Create React App: build"
