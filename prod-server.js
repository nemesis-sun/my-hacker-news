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

const app = express();


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
			console.log(renderProps.components);

      		const activeRoute = (<RouterContext {...renderProps} />);
      		const containerHTML = renderToString(<Provider store={store}>{activeRoute}</Provider>);
			const initialState = JSON.stringify(store.getState());

			res.send(`
		    <!doctype html>
		    <html>
		      <head>
		        <title>My Hacker News - Server Rendering</title>
		        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/css/materialize.min.css">
				<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
				<link href="static/css/style.css" rel="stylesheet">
		      </head>
		      <body>
		        <div id="hn-app-container" class='container'>${containerHTML}</div>
		        <script>
		          window.__INITIAL_STATE__ = ${initialState}
		        </script>
		        <script src="static/js/bundle.js"></script>
		      </body>
		    </html>
		    `);
		} else {
			console.log("404 Not found");
			res.status(404).send('Not found');
    	}
	});

}

app.listen(8080, function() {
  console.log('Express production server running at localhost:8080');
});