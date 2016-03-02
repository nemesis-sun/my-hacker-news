import Components from "./components"
import {Router, Route, Link, IndexRoute, browserHistory} from 'react-router'
import React from "react"

const RoutedApp = (
	<Router history={browserHistory} >
		<Route component={Components.HackerNews} path="/">
			<IndexRoute component={Components.ItemListView}></IndexRoute>
			<Route component={Components.ItemListView} path="asks"></Route>
			<Route component={Components.ItemListView} path="shows"></Route>
			<Route component={Components.ItemListView} path="latest"></Route>
			<Route component={Components.ItemDetailView} path="i/:id"></Route>
		</Route>
	</Router>
);

export default RoutedApp