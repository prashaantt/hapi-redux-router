'use strict';

const Boom = require('boom');
const Joi = require('joi');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const ReactRedux = require('react-redux');
const ReactRouter = require('react-router');


const internals = {};


internals.schema = Joi.object().keys({
    store: Joi.object().keys({
        dispatch: Joi.func().required(),
        subscribe: Joi.func().required(),
        getState: Joi.func().required(),
        replaceReducer: Joi.func().required()
    }),
    routes: Joi.array().required(),
    bootstrapAction: Joi.func(),
    template: Joi.string().required(),
    viewOptions: Joi.object(),
    params: Joi.object()
});


internals.validate = (options) => {

    return Joi.validate(options, internals.schema);
};


exports.register = (server, options, next) => {

    server.route({
        path: '/{path*}',
        method: 'GET',
        handler: function (request, reply) {

            const result = internals.validate(options);
            if (result.error) {
                return reply(Boom.badRequest(result.error));
            }

            const store = options.store;
            const routes = options.routes;
            const bootstrapAction = options.bootstrapAction;
            const template = options.template;
            const viewOptions = options.viewOptions;
            const params = options.params;

            ReactRouter.match({ routes, location: request.url }, (error, redirectLocation, renderProps) => {

                if (error) {
                    console.error(error);
                    return reply(error);
                }
                else if (redirectLocation) {
                    return reply.redirect(redirectLocation.pathname + redirectLocation.search);
                }
                else if (!renderProps) {
                    return reply(Boom.notFound('The route was not found'));
                }

                let promise;

                if (bootstrapAction) {
                    promise = Promise.resolve(store.dispatch(bootstrapAction()));
                }

                const InitialComponent = React.createElement(
                    ReactRedux.Provider,
                    { store: options.store },
                    React.createElement(ReactRouter.RoutingContext, renderProps)
                );

                const componentRenderedToString = ReactDOMServer.renderToString(InitialComponent);

                let initialState = {};

                if (store) {
                    initialState = store.getState();
                }

                const context = {
                    componentRenderedToString,
                    initialState: JSON.stringify(initialState)
                };

                Object.assign(context, params);

                if (promise) {
                    promise.then(() => reply.view(template, context, viewOptions))
                        .catch((err) => reply(err));
                }
                else {
                    return reply.view(template, context, viewOptions);
                }
            });
        }
    });

    next();
};


exports.register.attributes = {
    pkg: require('./package.json'),
    dependencies: 'vision'
};
