# WEBPACK TUTORIAL - STEP 7 - Linting

In this step we talk about linting.

## Setup

To start clone this project:

```
git clone --branch 7_step https://github.com/francescabassi/webpack-tutorial.git
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

## Sources
- [SurviveJS]
- [Pro React]
- [ESLint in React + Babel + Webpack]

[SurviveJS]: <http://survivejs.com/webpack/introduction/>
[Pro React]: <http://www.pro-react.com/materials/appendixA/>
[http://localhost:8080/]: <http://localhost:8080/>
[ESLint]: <http://eslint.org/>
[eslint]: <https://github.com/eslint/eslint>
[eslint-loader]: <https://github.com/MoOx/eslint-loader>
[eslint-plugin-react]: <https://github.com/yannickcr/eslint-plugin-react>
[Airbnb Style Guide]: <https://github.com/airbnb/javascript>
[ESLint configuration]: <https://www.npmjs.com/package/eslint-config-airbnb>
[ESLint in React + Babel + Webpack]: <https://medium.com/@tkssharma/eslint-in-react-babel-webpack-9cb1c4e86f4e#.d9llmp5pb>
