# WEBPACK TUTORIAL - STEP 9 - Create React App

In this step we see how Facebook tool "Create React App" works.

## Tutorial

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

## Sources
- [Create Apps with No Configuration]

[Create Apps with No Configuration]: <https://facebook.github.io/react/blog/2016/07/22/create-apps-with-no-configuration.html>
[Create React App]: <https://github.com/facebookincubator/create-react-app>

[webpack_create_list_img]: ./img/webpack_create_list.png "Create React Apps: command list"
[webpack_create_start_img]: ./img/webpack_create_start.png "Create React App: start"
[webpack_create_structure_img]: ./img/webpack_create_structure.png "Create React App: structure"
[webpack_create_build_img]: ./img/webpack_create_build.png "Create React App: build"
