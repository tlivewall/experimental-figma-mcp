# Livewall-Nextjs-boilerplate

This project was bootstrapped with [Create Next App](https://nextjs.org/docs/api-reference/create-next-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/vercel/next.js#readme).

## Table of Contents

- [Quick start](#quick-start)
- [Folder Structure](#folder-structure)
- [Creating-new-Components](#Creating-new-components)
  - [Basic folder setup](#basic-folder-setup)
  - [Adding a Stylesheet](#adding-a-stylesheet)
  - [Code Splitting](#code-splitting)
- [Available Scripts](#available-scripts)


## Quick start

1.  Make sure that you have at minimum Node.js v12.22.0 and npm v6 or above installed.
2.  Inside the frontend folder copy the contents of env.example over to an local .env file and fill in all needed values, APP_ENV is important here.
3.  Move the terminal to the appropriate folder: `cd frontend`.
4.  Run `npm install` in order to install dependencies.<br />
    _At this point you can run `npm run dev` to see the example app at `http://localhost:3000`._

Now you're ready to go!


## Folder Structure

After setup, the default project structure should look like this:

```
README.md
frontend/
  .husky/
  app/
    [locale]/
    api/
    styles/
    layout.tsx
  app-state/
    hooks/
    app-state.context.ts
    app-state.provider.tsx
    index.ts
  assets/
    icon/
  components/
    sections/
    ui/
  disctionaries/
    dictionary.ts
    en.json
    nl.json
  node_modules/
  public/
    favicon.ico
    locales/
      nl/
  themes/
    styles/
    utils/
    index.ts
  types/
  utils/
    error-handling/
    helpers/
    hooks/
    index.ts
  .env.dist
  .env.example
  .eslintrc.js
  .prettierrc
  i18nConfig.js
  middleware.ts
  next-env.d.ts
  next.config.js
  package.json
  postcss.config.js
  tailwind.config.js
  tsconfig.json
```

For the project to build, **these folders and filenames must exist**:

**Folders:**
* `app/` files inside this folder are treated as routes.

**Files:**
* `app/[locale]/page.tsx` is the Nextjs entry point.

You may create subdirectories inside `frontend`. For faster rebuilds, only files inside `frontend` are processed by Webpack.<br>
You need to **put any ts, tsx and CSS files inside `frontend`**, otherwise Webpack won’t see them.

You can, however, create more top-level directories.<br>
They will not be included in the production build so you can use them for things like documentation.

**This version of the boilerplate makes use of Next14's Approuter, read more about the approuter in the [official documentation](https://nextjs.org/docs/app)

## Creating new components

When creating a new component and deciding on the correct folder for the component, consider the below importing rule:

**Folders:**
* Layout ==> Sections ==> Ui 

* `Layout components` should be considered top level and may import from both Sections and Ui folders if needed.
* `Section components` should be considered mid level and may import from only from Ui folder and not the Layout folder.
* `Ui components` should be considered low level and may **not** import from either Layout or Sections folder.

Components may however import from same level and utils folder when needed.

**Important - Naming convention** naming convention throughout the app must be consistent, as such all folder must be `kebab-case`.
**If you ever doubt about naming convention, please contact a fellow developer and ask them to help you**


### `Basic folder setup`

Each component has to hold these specific files inside its respective folder, additional files can be added when needed and component specific child components are placed in a `components subfolder`: 

```
  [New component]/
    components/
    [New component].component.tsx
    [New component].stories.ts
    [New component].module.css
```

**Try to think how you want to organise your code before you start the project**. It's possible that within a project you end up making multiple 'header' components. In this case you can create a folder names 'headers' and specify the different type of header within this folder. Example:
```
  headers/
    components/
    homepage/
      homepage.component.tsx
    contact/
      contact.component.tsx
    detail/
      detail.component.tsx
```

### `Basic component example`

**example.component.tsx**

```tsx
import React, { Component } from 'react';
import Button from './Button'; // Import a component from another file

type Props ={
  color: string;
}

const Example: React.FC<Props> = ({color}) => {

  return <Button color={color} />;
}

export default Example; // Always use default exports
```

Be aware of the [difference between default and named exports](http://stackoverflow.com/questions/36795819/react-native-es-6-when-should-i-use-curly-braces-for-import/36796281#36796281). It is a common source of mistakes.

We suggest that you stick to using default imports and exports when a module only exports a single thing (for example, a component). That’s what you get when you use `export default Button` and `import Button from './Button'`.

Named exports are useful for utility modules that export several functions. A module may have at most one default export and as many named exports as you like.

Learn more about ES6 modules:

* [Exploring ES6: Modules](http://exploringjs.com/es6/ch_modules.html)
* [Understanding ES6: Modules](https://leanpub.com/understandinges6/read#leanpub-auto-encapsulating-code-with-modules)


### `Adding a Stylesheet`

This project setup uses [Webpack](https://webpack.js.org/) for handling all assets. Webpack offers a custom way of “extending” the concept of `import` beyond JavaScript. To express that a JavaScript file depends on a CSS file, you need to **import the CSS from the JavaScript file**:

**button.module.css**

```css
.button {
  padding: 20px;
}
```

**button.component.tsx**

```tsx
import React, { Component } from 'react';
import classes from './button.module.css'; // Tell Webpack that Button.js uses these styles

const Button = () => {

  return <div className={classes.button} />;
}

export default Example;
```

**This scopes your css to the specific component** but many people find this feature convenient. You can read about the benefits of this approach [here](https://medium.com/seek-ui-engineering/block-element-modifying-your-javascript-components-d7f99fcab52b). However you should be aware that this makes your code less portable to other build tools and environments than Webpack.

In development, expressing dependencies this way allows your styles to be reloaded on the fly as you edit them. In production, all CSS files will be concatenated into a single minified `.css` file in the build output.

If you need to globally set css, you can put all your CSS right into `styles/globals.css`. It would still be imported from `pages/_app.tsx`.


### `Code Splitting`

Instead of downloading the entire app before users can use it, code splitting allows you to split your code into small chunks which you can then load on demand.

This project setup supports code splitting via [dynamic `import()`](http://2ality.com/2017/01/import-operator.html#loading-code-on-demand). The `import()` function-like form takes the module name as an argument and returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which always resolves to the namespace object of the module.

Here is an example:

**module-a.ts**

```ts
const moduleA = 'Hello';

export { moduleA };
```
**example.component.tsx**

```tsx
import React, { Component } from 'react';

const Example = () => {
  const handleClick = () => {
    import('./module-a')
      .then(({ moduleA }) => {
        // Use moduleA
      })
      .catch(err => {
        // Handle failure
      });
  };

    return (
      <div>
        <button onClick={this.handleClick}>Load</button>
      </div>
    );
}

export default Example;
```

This will make `module-a.ts` and all its unique dependencies as a separate chunk that only loads after the user clicks the 'Load' button.

You can also use it with `async` / `await` syntax if you prefer it.



## Available Scripts

In the project directory, you can run:


### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.


### `npm ts-compile`

Launches the typescript test runner.<br>


### `npm run build`

Builds the app for production to the `.next` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!


### `npm run start`

Starts the app for production from the `.next` folder.

### `npm run analyze`

Builds the app for production with the bundle-analyzer activated.<br>

This opens two tabs in the browser for easy analysis of all the bundle sizes for both client and server.

Read more about it [here](https://www.flavienbonvin.com/reduce-next-js-bundle/) for more information.