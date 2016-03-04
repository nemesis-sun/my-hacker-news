import express from 'express';
import path from 'path';
import {renderToString} from 'react-dom/server';
import {createStore, combineReducers, applyMiddleware} from "redux"
import thunk from 'redux-thunk'
import * as reducers from "./src/js/reducers"
import {routes} from "./src/js/routes"
import {Provider, connect} from "react-redux"
import React from 'react'
import { match, RouterContext } from 'react-router'
import jade from 'jade'

const port = process.env.PORT || 8080;

const app = express();

app.set('view engine', 'jade');
app.set('views', './template');

app.use("/static", express.static('public'));

app.use("*", handleServerRendering);

function handleServerRendering(req, res){
	const store = createStore(combineReducers(reducers), applyMiddleware(thunk));
	console.log(req.originalUrl);
	
	match({routes, location: req.originalUrl}, (error, redirectLocation, renderProps) => {
		if (error) {
			console.log("Error 500");
			res.status(500).send(error.message);
    	} else if (redirectLocation) {
			console.log("Redirect 302");
			res.redirect(302, redirectLocation.pathname + redirectLocation.search);
		} else if (renderProps) {
			console.log("Route found");

      		const activeRoute = (<Provider store={store}><RouterContext {...renderProps} /></Provider>);
      		const containerHTML = renderToString(activeRoute);
			const initialState = JSON.stringify(store.getState());
			
			res.render('index', {
				pageTitle: 'My Hacker News - Server Rendering',
				renderedHTML: containerHTML,
				initialState: initialState
			});
		} else {
			console.log("404 Not found");
			res.status(404).send('Not found');
    	}
	});

}

app.listen(port, function() {
  console.log('Express production server running at port '+port);
});