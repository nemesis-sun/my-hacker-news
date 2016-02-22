import Components from "./components"
import {Router, Route, Link, hashHistory} from 'react-router'
import React from "react"

const RoutedApp = (
	<Router history={hashHistory} >
		<Route component={Components.HackerNews} path="/">
			<Route component={Components.StoryListView} path="list"></Route>
			<Route component={Components.StoryDetailView} path="s/:sid"></Route>
		</Route>
	</Router>
);

export default RoutedApp