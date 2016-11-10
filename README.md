# WEBPACK TUTORIAL - STEP 3 - Webpack Development Server and Source Maps

This step introduces the Webpack Dev Server and the Source Maps option.

## Setup

To start clone this project:

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

You can see the result open in your browser the http://localhost:8080/ url.

Then build the project:

```
npm run build
```

## Tutorial

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

## Sources
- [SurviveJS]
- [Pro React]

[SurviveJS]: <http://survivejs.com/webpack/introduction/>
[Pro React]: <http://www.pro-react.com/materials/appendixA/>
