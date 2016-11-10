# WEBPACK TUTORIAL - STEP 5 - CSS

In this step we discover the loaders for the stylesheets and the css modules.

## Setup

To start clone this project:

```
git clone --branch 5_step https://github.com/francescabassi/webpack-tutorial.git
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

## Sources
- [SurviveJS]
- [Pro React]

[SurviveJS]: <http://survivejs.com/webpack/introduction/>
[Pro React]: <http://www.pro-react.com/materials/appendixA/>
[http://localhost:8080/]: <http://localhost:8080/>
[CSS modules]: <https://github.com/css-modules/css-modules>
