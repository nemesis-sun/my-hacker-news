import Components from "./components"
import {Router, Route, Link, IndexRoute, hashHistory} from 'react-router'
import React from "react"

const RoutedApp = (
	<Router history={hashHistory} >
		<Route component={Components.HackerNews} path="/">
			<IndexRoute component={Components.ItemListView}></IndexRoute>
			<Route component={Components.ItemListView} path="asks"></Route>
			<Route component={Components.StoryDetailView} path="s/:sid"></Route>
		</Route>
	</Router>
);

export default RoutedApp