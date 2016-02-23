import {render} from "react-dom"
import React from "react"
import {Provider, connect} from "react-redux"
import {createStore, combineReducers, applyMiddleware} from "redux"
import thunk from 'redux-thunk'
import * as reducers from "./src/js/reducers"
import * as actionTypes from "./src/js/actionTypes"
import RoutedApp from "./src/js/routes"

const store = createStore(combineReducers(reducers), applyMiddleware(thunk));


render(<Provider store={store}>{RoutedApp}</Provider>, document.getElementById("hn-app-container"));

