import {render} from "react-dom"
import React from "react"
import {Provider, connect} from "react-redux"
import {createStore, combineReducers, applyMiddleware} from "redux"
import thunk from 'redux-thunk'
import * as reducers from "./reducers"
import * as actionTypes from "./actionTypes"
import RoutedApp from "./routes"

const store = createStore(combineReducers(reducers), applyMiddleware(thunk));


render(<Provider store={store}>{RoutedApp}</Provider>, document.getElementById("hn-app-container"));

