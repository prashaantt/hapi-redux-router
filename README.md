> ## Update

> Deprecated in favour of https://github.com/prashaantt/hapi-react-ssr.

# hapi-redux-router

Currently only supports manifest-style route declarations.

[![Dependency Status](https://david-dm.org/prashaantt/hapi-redux-router.svg)](https://david-dm.org/prashaantt/hapi-redux-router)
[![devDependency Status](https://david-dm.org/prashaantt/hapi-redux-router/dev-status.svg?theme=shields.io)](https://david-dm.org/prashaantt/hapi-redux-router#info=devDependencies)

## Installation

```bash
$ npm install hapi-redux-router --save
```


## Usage

Define your routes as a manifest:

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


## Options

The plugin accepts the following ```options```:

- ```store``` (Object - optional): The redux store, generally created using ```Redux.createStore()```, but stores created with redux middleware work just fine too.
- ```routes``` (Array - required): The routes to React components declared as a manifest.
- ```bootstrapAction``` (Function - optional): The redux action to dispatch to load the initial data.
- ```template``` (String - required): The template file ```/path/name``` to use for rendering the view. Internally uses ```reply.view``` provided by ```vision```. The templating engine to use is up to you. See [vision](https://github.com/hapijs/vision) docs.
- ```params``` (Object - optional): Additional params to pass to the template context object. ```componentRenderedToString``` and ```initialState``` are reserved for internal use (see below).


## Notes


- This plugin uses ```componentRenderedToString``` prop to store the server-side rendered root React component, and ```initialState``` to store the computed initial state from the Redux store. Include them appropriately in your template.

```hbs
{{! handlebars example }}

<html>
<body>
    <div id="react-root">{{{ componentRenderedToString }}}</div>
    <script type="application/javascript">
        {{#if initialState}}
        window.__INITIAL_STATE__ = {{{ initialState }}};
        {{/if}}
    </script>
</body>
</html>
```


- If you're using ES6-style module exports for routes and action files, ensure to pass their appropriate exports to this plugin.

```js
const reducer = require('./my-reducer').default;
const bootstrapAction = require('../my-actions').defaultAction;
```


- This plugin uses a catch-all hapi route to pass all incoming requests to the react-router. You will generally need to override this behaviour with other more specific routes in your app — to serve static files, for example.  


## Example

Look at [hapi-react-transform-boilerplate](https://github.com/prashaantt/hapi-react-transform-boilerplate) to see this plugin in action. 


## License

MIT
