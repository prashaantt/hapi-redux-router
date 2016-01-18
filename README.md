# hapi-redux-router

Currently only supports manifest-style route declarations.

[![Dependency Status](https://david-dm.org/prashaantt/hapi-redux-router.svg)](https://david-dm.org/prashaantt/hapi-redux-router)
[![devDependency Status](https://david-dm.org/prashaantt/hapi-redux-router/dev-status.svg?theme=shields.io)](https://david-dm.org/prashaantt/hapi-redux-router#info=devDependencies)

## Installation

```bash
$ npm install hapi-redux-router --save
```

## Usage

Define your routes as a manifest (ES6 module imports also work just fine with an intermediate transpilation step):

```js
const App = require('./App');
const Homepage = require('./Homepage');


const routes = [
    {
        path: '/',
        component: App,
        indexRoute: { component: Homepage },
        childRoutes: [...]
    }
];


module.exports = routes;
```

Require and register normally as a hapi plugin ([vision](https://github.com/hapijs/vision) is a dependency for rendering the template):

```js
const HapiReduxRouter = require('hapi-redux-router');
const Vision = require('vision');


server.register([
    {
        register: Vision
    },
    {
        register: HapiReduxRouter,
        options: {...}
    }
]); 
```

The plugin accepts the following ```options```:

- ```store``` (Object - optional): The redux store, generally created using ```Redux.createStore()```, but stores created with redux middleware work just fine too.
- ```routes``` (Array - required): The routes passed as a manifest of the form (ES6 module imports work just as well with Babel):
- ```bootstrapAction``` (Function - optional): The redux action to dispatch to load the initial data.
- ```template``` (String - required): The template file ```/path/name``` to use for rendering the view. Internally uses ```reply.view``` provided by ```vision```. The templating engine to use is entirely up to you.
- ```params``` (Object - optional): Additional params to pass to the template context object.

## License

MIT
