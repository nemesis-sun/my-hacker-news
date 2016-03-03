/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch(e) {
/******/ 			return callback();
/******/ 		}
/******/ 		callback(null, update);
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "8066a921e3ba8d7fecab"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(Object.defineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(Object.defineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(2), RootInstanceProvider = __webpack_require__(10), ReactMount = __webpack_require__(12), React = __webpack_require__(13); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {\n\n'use strict';\n\nvar _express = __webpack_require__(14);\n\nvar _express2 = _interopRequireDefault(_express);\n\nvar _path = __webpack_require__(15);\n\nvar _path2 = _interopRequireDefault(_path);\n\nvar _server = __webpack_require__(16);\n\nvar _redux = __webpack_require__(17);\n\nvar _reduxThunk = __webpack_require__(18);\n\nvar _reduxThunk2 = _interopRequireDefault(_reduxThunk);\n\nvar _reducers = __webpack_require__(19);\n\nvar reducers = _interopRequireWildcard(_reducers);\n\nvar _routes = __webpack_require__(24);\n\nvar _reactRedux = __webpack_require__(27);\n\nvar _react = __webpack_require__(13);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRouter = __webpack_require__(26);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar app = (0, _express2.default)();\n\napp.use(\"/static\", _express2.default.static('public'));\n\napp.use(\"*\", handleServerRendering);\n\nfunction handleServerRendering(req, res) {\n\tvar store = (0, _redux.createStore)((0, _redux.combineReducers)(reducers), (0, _redux.applyMiddleware)(_reduxThunk2.default));\n\tconsole.log(req.originalUrl);\n\n\t(0, _reactRouter.match)({ routes: _routes.routes, location: req.originalUrl }, function (error, redirectLocation, renderProps) {\n\t\tif (error) {\n\t\t\tconsole.log(\"Error 500\");\n\t\t\tres.status(500).send(error.message);\n\t\t} else if (redirectLocation) {\n\t\t\tconsole.log(\"Redirect 302\");\n\t\t\tres.redirect(302, redirectLocation.pathname + redirectLocation.search);\n\t\t} else if (renderProps) {\n\t\t\tconsole.log(\"Route found\");\n\t\t\tconsole.log(renderProps.components);\n\n\t\t\tvar activeRoute = _react2.default.createElement(_reactRouter.RouterContext, renderProps);\n\t\t\tvar containerHTML = (0, _server.renderToString)(_react2.default.createElement(\n\t\t\t\t_reactRedux.Provider,\n\t\t\t\t{ store: store },\n\t\t\t\tactiveRoute\n\t\t\t));\n\t\t\tvar initialState = JSON.stringify(store.getState());\n\n\t\t\tres.send('\\n\\t\\t    <!doctype html>\\n\\t\\t    <html>\\n\\t\\t      <head>\\n\\t\\t        <title>My Hacker News - Server Rendering</title>\\n\\t\\t        <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/css/materialize.min.css\">\\n\\t\\t\\t\\t<link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">\\n\\t\\t\\t\\t<link href=\"static/css/style.css\" rel=\"stylesheet\">\\n\\t\\t      </head>\\n\\t\\t      <body>\\n\\t\\t        <div id=\"hn-app-container\" class=\\'container\\'>' + containerHTML + '</div>\\n\\t\\t        <script>\\n\\t\\t          window.__INITIAL_STATE__ = ' + initialState + '\\n\\t\\t        </script>\\n\\t\\t        <script src=\"static/js/bundle.js\"></script>\\n\\t\\t      </body>\\n\\t\\t    </html>\\n\\t\\t    ');\n\t\t} else {\n\t\t\tconsole.log(\"404 Not found\");\n\t\t\tres.status(404).send('Not found');\n\t\t}\n\t});\n}\n\napp.listen(8080, function () {\n\tconsole.log('Express production server running at localhost:8080');\n});\n\n/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(21); if (makeExportsHot(module, __webpack_require__(13))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error(\"Cannot not apply hot update to \" + \"prod-server.js\" + \": \" + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))\n\n/*****************\n ** WEBPACK FOOTER\n ** ./prod-server.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./prod-server.js?");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("module.exports = function(module) {\r\n\tif(!module.webpackPolyfill) {\r\n\t\tmodule.deprecate = function() {};\r\n\t\tmodule.paths = [];\r\n\t\t// module.parent = undefined by default\r\n\t\tmodule.children = [];\r\n\t\tmodule.webpackPolyfill = 1;\r\n\t}\r\n\treturn module;\r\n}\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** (webpack)/buildin/module.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///(webpack)/buildin/module.js?");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nmodule.exports = __webpack_require__(3);\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/react-hot-loader/~/react-hot-api/modules/index.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/react-hot-loader/~/react-hot-api/modules/index.js?");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar makePatchReactClass = __webpack_require__(4);\n\n/**\n * Returns a function that, when invoked, patches a React class with a new\n * version of itself. To patch different classes, pass different IDs.\n */\nmodule.exports = function makeMakeHot(getRootInstances, React) {\n  if (typeof getRootInstances !== 'function') {\n    throw new Error('Expected getRootInstances to be a function.');\n  }\n\n  var patchers = {};\n\n  return function makeHot(NextClass, persistentId) {\n    persistentId = persistentId || NextClass.displayName || NextClass.name;\n\n    if (!persistentId) {\n      console.error(\n        'Hot reload is disabled for one of your types. To enable it, pass a ' +\n        'string uniquely identifying this class within this current module ' +\n        'as a second parameter to makeHot.'\n      );\n      return NextClass;\n    }\n\n    if (!patchers[persistentId]) {\n      patchers[persistentId] = makePatchReactClass(getRootInstances, React);\n    }\n\n    var patchReactClass = patchers[persistentId];\n    return patchReactClass(NextClass);\n  };\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/react-hot-loader/~/react-hot-api/modules/makeMakeHot.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/react-hot-loader/~/react-hot-api/modules/makeMakeHot.js?");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar makeAssimilatePrototype = __webpack_require__(5),\n    requestForceUpdateAll = __webpack_require__(6);\n\nfunction hasNonStubTypeProperty(ReactClass) {\n  if (!ReactClass.hasOwnProperty('type')) {\n    return false;\n  }\n\n  var descriptor = Object.getOwnPropertyDescriptor(ReactClass, 'type');\n  if (typeof descriptor.get === 'function') {\n    return false;\n  }\n\n  return true;\n}\n\nfunction getPrototype(ReactClass) {\n  var prototype = ReactClass.prototype,\n      seemsLegit = prototype && typeof prototype.render === 'function';\n\n  if (!seemsLegit && hasNonStubTypeProperty(ReactClass)) {\n    prototype = ReactClass.type.prototype;\n  }\n\n  return prototype;\n}\n\n/**\n * Returns a function that will patch React class with new versions of itself\n * on subsequent invocations. Both legacy and ES6 style classes are supported.\n */\nmodule.exports = function makePatchReactClass(getRootInstances, React) {\n  var assimilatePrototype = makeAssimilatePrototype(),\n      FirstClass = null;\n\n  return function patchReactClass(NextClass) {\n    var nextPrototype = getPrototype(NextClass);\n    assimilatePrototype(nextPrototype);\n\n    if (FirstClass) {\n      requestForceUpdateAll(getRootInstances, React);\n    }\n\n    return FirstClass || (FirstClass = NextClass);\n  };\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/react-hot-loader/~/react-hot-api/modules/makePatchReactClass.js\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/react-hot-loader/~/react-hot-api/modules/makePatchReactClass.js?");

/***/ },
/* 5 */
/***/ function(module, exports) {

	eval("'use strict';\n\n/**\n * Returns a function that establishes the first prototype passed to it\n * as the \"source of truth\" and patches its methods on subsequent invocations,\n * also patching current and previous prototypes to forward calls to it.\n */\nmodule.exports = function makeAssimilatePrototype() {\n  var storedPrototype,\n      knownPrototypes = [];\n\n  function wrapMethod(key) {\n    return function () {\n      if (storedPrototype[key]) {\n        return storedPrototype[key].apply(this, arguments);\n      }\n    };\n  }\n\n  function patchProperty(proto, key) {\n    proto[key] = storedPrototype[key];\n\n    if (typeof proto[key] !== 'function' ||\n      key === 'type' ||\n      key === 'constructor') {\n      return;\n    }\n\n    proto[key] = wrapMethod(key);\n\n    if (storedPrototype[key].isReactClassApproved) {\n      proto[key].isReactClassApproved = storedPrototype[key].isReactClassApproved;\n    }\n\n    if (proto.__reactAutoBindMap && proto.__reactAutoBindMap[key]) {\n      proto.__reactAutoBindMap[key] = proto[key];\n    }\n  }\n\n  function updateStoredPrototype(freshPrototype) {\n    storedPrototype = {};\n\n    Object.getOwnPropertyNames(freshPrototype).forEach(function (key) {\n      storedPrototype[key] = freshPrototype[key];\n    });\n  }\n\n  function reconcileWithStoredPrototypes(freshPrototype) {\n    knownPrototypes.push(freshPrototype);\n    knownPrototypes.forEach(function (proto) {\n      Object.getOwnPropertyNames(storedPrototype).forEach(function (key) {\n        patchProperty(proto, key);\n      });\n    });\n  }\n\n  return function assimilatePrototype(freshPrototype) {\n    if (Object.prototype.hasOwnProperty.call(freshPrototype, '__isAssimilatedByReactHotAPI')) {\n      return;\n    }\n\n    updateStoredPrototype(freshPrototype);\n    reconcileWithStoredPrototypes(freshPrototype);\n    freshPrototype.__isAssimilatedByReactHotAPI = true;\n  };\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/react-hot-loader/~/react-hot-api/modules/makeAssimilatePrototype.js\n ** module id = 5\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/react-hot-loader/~/react-hot-api/modules/makeAssimilatePrototype.js?");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	eval("var deepForceUpdate = __webpack_require__(7);\n\nvar isRequestPending = false;\n\nmodule.exports = function requestForceUpdateAll(getRootInstances, React) {\n  if (isRequestPending) {\n    return;\n  }\n\n  /**\n   * Forces deep re-render of all mounted React components.\n   * Hats off to Omar Skalli (@Chetane) for suggesting this approach:\n   * https://gist.github.com/Chetane/9a230a9fdcdca21a4e29\n   */\n  function forceUpdateAll() {\n    isRequestPending = false;\n\n    var rootInstances = getRootInstances(),\n        rootInstance;\n\n    for (var key in rootInstances) {\n      if (rootInstances.hasOwnProperty(key)) {\n        rootInstance = rootInstances[key];\n\n        // `|| rootInstance` for React 0.12 and earlier\n        rootInstance = rootInstance._reactInternalInstance || rootInstance;\n        deepForceUpdate(rootInstance, React);\n      }\n    }\n  }\n\n  setTimeout(forceUpdateAll);\n};\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/react-hot-loader/~/react-hot-api/modules/requestForceUpdateAll.js\n ** module id = 6\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/react-hot-loader/~/react-hot-api/modules/requestForceUpdateAll.js?");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar bindAutoBindMethods = __webpack_require__(8);\nvar traverseRenderedChildren = __webpack_require__(9);\n\nfunction setPendingForceUpdate(internalInstance) {\n  if (internalInstance._pendingForceUpdate === false) {\n    internalInstance._pendingForceUpdate = true;\n  }\n}\n\nfunction forceUpdateIfPending(internalInstance, React) {\n  if (internalInstance._pendingForceUpdate === true) {\n    // `|| internalInstance` for React 0.12 and earlier\n    var instance = internalInstance._instance || internalInstance;\n\n    if (instance.forceUpdate) {\n      instance.forceUpdate();\n    } else if (React && React.Component) {\n      React.Component.prototype.forceUpdate.call(instance);\n    }\n  }\n}\n\n/**\n * Updates a React component recursively, so even if children define funky\n * `shouldComponentUpdate`, they are forced to re-render.\n * Makes sure that any newly added methods are properly auto-bound.\n */\nfunction deepForceUpdate(internalInstance, React) {\n  traverseRenderedChildren(internalInstance, bindAutoBindMethods);\n  traverseRenderedChildren(internalInstance, setPendingForceUpdate);\n  traverseRenderedChildren(internalInstance, forceUpdateIfPending, React);\n}\n\nmodule.exports = deepForceUpdate;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/react-hot-loader/~/react-hot-api/modules/deepForceUpdate.js\n ** module id = 7\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/react-hot-loader/~/react-hot-api/modules/deepForceUpdate.js?");

/***/ },
/* 8 */
/***/ function(module, exports) {

	eval("'use strict';\n\nfunction bindAutoBindMethod(component, method) {\n  var boundMethod = method.bind(component);\n\n  boundMethod.__reactBoundContext = component;\n  boundMethod.__reactBoundMethod = method;\n  boundMethod.__reactBoundArguments = null;\n\n  var componentName = component.constructor.displayName,\n      _bind = boundMethod.bind;\n\n  boundMethod.bind = function (newThis) {\n    var args = Array.prototype.slice.call(arguments, 1);\n    if (newThis !== component && newThis !== null) {\n      console.warn(\n        'bind(): React component methods may only be bound to the ' +\n        'component instance. See ' + componentName\n      );\n    } else if (!args.length) {\n      console.warn(\n        'bind(): You are binding a component method to the component. ' +\n        'React does this for you automatically in a high-performance ' +\n        'way, so you can safely remove this call. See ' + componentName\n      );\n      return boundMethod;\n    }\n\n    var reboundMethod = _bind.apply(boundMethod, arguments);\n    reboundMethod.__reactBoundContext = component;\n    reboundMethod.__reactBoundMethod = method;\n    reboundMethod.__reactBoundArguments = args;\n\n    return reboundMethod;\n  };\n\n  return boundMethod;\n}\n\n/**\n * Performs auto-binding similar to how React does it.\n * Skips already auto-bound methods.\n * Based on https://github.com/facebook/react/blob/b264372e2b3ad0b0c0c0cc95a2f383e4a1325c3d/src/classic/class/ReactClass.js#L639-L705\n */\nmodule.exports = function bindAutoBindMethods(internalInstance) {\n  var component = typeof internalInstance.getPublicInstance === 'function' ?\n    internalInstance.getPublicInstance() :\n    internalInstance;\n\n  if (!component) {\n    // React 0.14 stateless component has no instance\n    return;\n  }\n\n  for (var autoBindKey in component.__reactAutoBindMap) {\n    if (!component.__reactAutoBindMap.hasOwnProperty(autoBindKey)) {\n      continue;\n    }\n\n    // Skip already bound methods\n    if (component.hasOwnProperty(autoBindKey) &&\n        component[autoBindKey].__reactBoundContext === component) {\n      continue;\n    }\n\n    var method = component.__reactAutoBindMap[autoBindKey];\n    component[autoBindKey] = bindAutoBindMethod(component, method);\n  }\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/react-hot-loader/~/react-hot-api/modules/bindAutoBindMethods.js\n ** module id = 8\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/react-hot-loader/~/react-hot-api/modules/bindAutoBindMethods.js?");

/***/ },
/* 9 */
/***/ function(module, exports) {

	eval("'use strict';\n\nfunction traverseRenderedChildren(internalInstance, callback, argument) {\n  callback(internalInstance, argument);\n\n  if (internalInstance._renderedComponent) {\n    traverseRenderedChildren(\n      internalInstance._renderedComponent,\n      callback,\n      argument\n    );\n  } else {\n    for (var key in internalInstance._renderedChildren) {\n      traverseRenderedChildren(\n        internalInstance._renderedChildren[key],\n        callback,\n        argument\n      );\n    }\n  }\n}\n\nmodule.exports = traverseRenderedChildren;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/react-hot-loader/~/react-hot-api/modules/traverseRenderedChildren.js\n ** module id = 9\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/react-hot-loader/~/react-hot-api/modules/traverseRenderedChildren.js?");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar getRootInstancesFromReactMount = __webpack_require__(11);\n\nvar injectedProvider = null,\n    didWarn = false;\n\nfunction warnOnce() {\n  if (!didWarn) {\n    console.warn(\n      'It appears that React Hot Loader isn\\'t configured correctly. ' +\n      'If you\\'re using NPM, make sure your dependencies don\\'t drag duplicate React distributions into their node_modules and that require(\"react\") corresponds to the React instance you render your app with.',\n      'If you\\'re using a precompiled version of React, see https://github.com/gaearon/react-hot-loader/tree/master/docs#usage-with-external-react for integration instructions.'\n    );\n  }\n\n  didWarn = true;\n}\n\nvar RootInstanceProvider = {\n  injection: {\n    injectProvider: function (provider) {\n      injectedProvider = provider;\n    }\n  },\n\n  getRootInstances: function (ReactMount) {\n    if (injectedProvider) {\n      return injectedProvider.getRootInstances();\n    }\n\n    var instances = ReactMount && getRootInstancesFromReactMount(ReactMount) || [];\n    if (!Object.keys(instances).length) {\n      warnOnce();\n    }\n\n    return instances;\n  }\n};\n\nmodule.exports = RootInstanceProvider;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/react-hot-loader/RootInstanceProvider.js\n ** module id = 10\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/react-hot-loader/RootInstanceProvider.js?");

/***/ },
/* 11 */
/***/ function(module, exports) {

	eval("'use strict';\n\nfunction getRootInstancesFromReactMount(ReactMount) {\n  return ReactMount._instancesByReactRootID || ReactMount._instancesByContainerID || [];\n}\n\nmodule.exports = getRootInstancesFromReactMount;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/react-hot-loader/getRootInstancesFromReactMount.js\n ** module id = 11\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/react-hot-loader/getRootInstancesFromReactMount.js?");

/***/ },
/* 12 */
/***/ function(module, exports) {

	eval("module.exports = require(\"react/lib/ReactMount\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"react/lib/ReactMount\"\n ** module id = 12\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22react/lib/ReactMount%22?");

/***/ },
/* 13 */
/***/ function(module, exports) {

	eval("module.exports = require(\"react\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"react\"\n ** module id = 13\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22react%22?");

/***/ },
/* 14 */
/***/ function(module, exports) {

	eval("module.exports = require(\"express\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"express\"\n ** module id = 14\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22express%22?");

/***/ },
/* 15 */
/***/ function(module, exports) {

	eval("module.exports = require(\"path\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"path\"\n ** module id = 15\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22path%22?");

/***/ },
/* 16 */
/***/ function(module, exports) {

	eval("module.exports = require(\"react-dom/server\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"react-dom/server\"\n ** module id = 16\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22react-dom/server%22?");

/***/ },
/* 17 */
/***/ function(module, exports) {

	eval("module.exports = require(\"redux\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"redux\"\n ** module id = 17\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22redux%22?");

/***/ },
/* 18 */
/***/ function(module, exports) {

	eval("module.exports = require(\"redux-thunk\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"redux-thunk\"\n ** module id = 18\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22redux-thunk%22?");

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	eval("/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(2), RootInstanceProvider = __webpack_require__(10), ReactMount = __webpack_require__(12), React = __webpack_require__(13); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {\n\n\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nexports.stories = stories;\nexports.itemDetail = itemDetail;\nexports.comments = comments;\nexports.asks = asks;\nexports.shows = shows;\nexports.latest = latest;\n\nvar _actionTypes = __webpack_require__(20);\n\nvar actionTypes = _interopRequireWildcard(_actionTypes);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction stories() {\n\tvar state = arguments.length <= 0 || arguments[0] === undefined ? { invalidated: true, data: [], lastRefresh: 0 } : arguments[0];\n\tvar action = arguments[1];\n\n\tif (action.type === actionTypes.INVALIDATE_STORIES) {\n\n\t\treturn {\n\t\t\tinvalidated: true,\n\t\t\tdata: [],\n\t\t\tlastRefresh: action.lastRefresh\n\t\t};\n\t} else if (action.type === actionTypes.REFRESH_STORIES) {\n\n\t\treturn {\n\t\t\tinvalidated: false,\n\t\t\tdata: state.data.concat(action.data),\n\t\t\tlastRefresh: action.lastRefresh\n\t\t};\n\t}\n\n\treturn state;\n}\n\nfunction itemDetail() {\n\tvar state = arguments.length <= 0 || arguments[0] === undefined ? { invalidated: true, story: null } : arguments[0];\n\tvar action = arguments[1];\n\n\tif (action.type === actionTypes.VIEW_ITEM_DETAIL) {\n\t\treturn {\n\t\t\tinvalidated: true,\n\t\t\titem: null\n\t\t};\n\t} else if (action.type === actionTypes.REFRESH_ITEM_DETAIL) {\n\t\treturn {\n\t\t\tinvalidated: false,\n\t\t\titem: action.data\n\t\t};\n\t}\n\n\treturn state;\n}\n\nfunction comments() {\n\tvar state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];\n\tvar action = arguments[1];\n\n\n\tif (action.type === actionTypes.VIEW_STORY_DETAIL) {\n\t\tconsole.log(\"reducer:comments:VIEW_STORY_DETAIL\");\n\t\treturn [];\n\t} else if (action.type === actionTypes.PUSH_COMMENTS) {\n\t\tconsole.log(\"reducer:comments:PUSH_COMMENTS\");\n\t\treturn state.concat(action.comments);\n\t}\n\n\treturn state;\n}\n\nfunction asks() {\n\tvar state = arguments.length <= 0 || arguments[0] === undefined ? { invalidated: true, data: [], lastRefresh: 0 } : arguments[0];\n\tvar action = arguments[1];\n\n\n\tif (action.type === actionTypes.INVALIDATE_ASKS) {\n\t\treturn {\n\t\t\tinvalidated: true,\n\t\t\tdata: [],\n\t\t\tlastRefresh: action.lastRefresh\n\t\t};\n\t} else if (action.type === actionTypes.REFRESH_ASKS) {\n\t\treturn {\n\t\t\tinvalidated: false,\n\t\t\tdata: state.data.concat(action.data),\n\t\t\tlastRefresh: action.lastRefresh\n\t\t};\n\t}\n\n\treturn state;\n}\n\nfunction shows() {\n\tvar state = arguments.length <= 0 || arguments[0] === undefined ? { invalidated: true, data: [], lastRefresh: 0 } : arguments[0];\n\tvar action = arguments[1];\n\n\n\tif (action.type === actionTypes.INVALIDATE_SHOWS) {\n\t\treturn {\n\t\t\tinvalidated: true,\n\t\t\tdata: [],\n\t\t\tlastRefresh: action.lastRefresh\n\t\t};\n\t} else if (action.type === actionTypes.REFRESH_SHOWS) {\n\t\treturn {\n\t\t\tinvalidated: false,\n\t\t\tdata: state.data.concat(action.data),\n\t\t\tlastRefresh: action.lastRefresh\n\t\t};\n\t}\n\n\treturn state;\n}\n\nfunction latest() {\n\tvar state = arguments.length <= 0 || arguments[0] === undefined ? { invalidated: true, data: [], lastRefresh: 0 } : arguments[0];\n\tvar action = arguments[1];\n\n\n\tif (action.type === actionTypes.INVALIDATE_LATEST) {\n\t\treturn {\n\t\t\tinvalidated: true,\n\t\t\tdata: [],\n\t\t\tlastRefresh: action.lastRefresh\n\t\t};\n\t} else if (action.type === actionTypes.REFRESH_LATEST) {\n\t\treturn {\n\t\t\tinvalidated: false,\n\t\t\tdata: state.data.concat(action.data),\n\t\t\tlastRefresh: action.lastRefresh\n\t\t};\n\t}\n\n\treturn state;\n}\n\n/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(21); if (makeExportsHot(module, __webpack_require__(13))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error(\"Cannot not apply hot update to \" + \"reducers.js\" + \": \" + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/reducers.js\n ** module id = 19\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/reducers.js?");

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	eval("/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(2), RootInstanceProvider = __webpack_require__(10), ReactMount = __webpack_require__(12), React = __webpack_require__(13); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {\n\n\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar INVALIDATE_STORIES = exports.INVALIDATE_STORIES = \"INVALIDATE_STORIES\";\nvar REFRESH_STORIES = exports.REFRESH_STORIES = \"REFRESH_STORIES\";\nvar VIEW_ITEM_DETAIL = exports.VIEW_ITEM_DETAIL = \"VIEW_ITEM_DETAIL\";\nvar REFRESH_ITEM_DETAIL = exports.REFRESH_ITEM_DETAIL = \"REFRESH_ITEM_DETAIL\";\nvar PUSH_COMMENTS = exports.PUSH_COMMENTS = \"PUSH_COMMENTS\";\nvar INVALIDATE_ASKS = exports.INVALIDATE_ASKS = \"INVALIDATE_ASKS\";\nvar REFRESH_ASKS = exports.REFRESH_ASKS = \"REFRESH_ASKS\";\nvar INVALIDATE_SHOWS = exports.INVALIDATE_SHOWS = \"INVALIDATE_SHOWS\";\nvar REFRESH_SHOWS = exports.REFRESH_SHOWS = \"REFRESH_SHOWS\";\nvar INVALIDATE_LATEST = exports.INVALIDATE_LATEST = \"INVALIDATE_LATEST\";\nvar REFRESH_LATEST = exports.REFRESH_LATEST = \"REFRESH_LATEST\";\n\n/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(21); if (makeExportsHot(module, __webpack_require__(13))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error(\"Cannot not apply hot update to \" + \"actionTypes.js\" + \": \" + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/actionTypes.js\n ** module id = 20\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/actionTypes.js?");

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar isReactClassish = __webpack_require__(22),\n    isReactElementish = __webpack_require__(23);\n\nfunction makeExportsHot(m, React) {\n  if (isReactElementish(m.exports, React)) {\n    // React elements are never valid React classes\n    return false;\n  }\n\n  var freshExports = m.exports,\n      exportsReactClass = isReactClassish(m.exports, React),\n      foundReactClasses = false;\n\n  if (exportsReactClass) {\n    m.exports = m.makeHot(m.exports, '__MODULE_EXPORTS');\n    foundReactClasses = true;\n  }\n\n  for (var key in m.exports) {\n    if (!Object.prototype.hasOwnProperty.call(freshExports, key)) {\n      continue;\n    }\n\n    if (exportsReactClass && key === 'type') {\n      // React 0.12 also puts classes under `type` property for compat.\n      // Skip to avoid updating twice.\n      continue;\n    }\n\n    var value;\n    try {\n      value = freshExports[key];\n    } catch (err) {\n      continue;\n    }\n\n    if (!isReactClassish(value, React)) {\n      continue;\n    }\n\n    if (Object.getOwnPropertyDescriptor(m.exports, key).writable) {\n      m.exports[key] = m.makeHot(value, '__MODULE_EXPORTS_' + key);\n      foundReactClasses = true;\n    } else {\n      console.warn(\"Can't make class \" + key + \" hot reloadable due to being read-only. To fix this you can try two solutions. First, you can exclude files or directories (for example, /node_modules/) using 'exclude' option in loader configuration. Second, if you are using Babel, you can enable loose mode for `es6.modules` using the 'loose' option. See: http://babeljs.io/docs/advanced/loose/ and http://babeljs.io/docs/usage/options/\");\n    }\n  }\n\n  return foundReactClasses;\n}\n\nmodule.exports = makeExportsHot;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/react-hot-loader/makeExportsHot.js\n ** module id = 21\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/react-hot-loader/makeExportsHot.js?");

/***/ },
/* 22 */
/***/ function(module, exports) {

	eval("function hasRender(Class) {\n  var prototype = Class.prototype;\n  if (!prototype) {\n    return false;\n  }\n\n  return typeof prototype.render === 'function';\n}\n\nfunction descendsFromReactComponent(Class, React) {\n  if (!React.Component) {\n    return false;\n  }\n\n  var Base = Object.getPrototypeOf(Class);\n  while (Base) {\n    if (Base === React.Component) {\n      return true;\n    }\n\n    Base = Object.getPrototypeOf(Base);\n  }\n\n  return false;\n}\n\nfunction isReactClassish(Class, React) {\n  if (typeof Class !== 'function') {\n    return false;\n  }\n\n  // React 0.13\n  if (hasRender(Class) || descendsFromReactComponent(Class, React)) {\n    return true;\n  }\n\n  // React 0.12 and earlier\n  if (Class.type && hasRender(Class.type)) {\n    return true;\n  }\n\n  return false;\n}\n\nmodule.exports = isReactClassish;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/react-hot-loader/isReactClassish.js\n ** module id = 22\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/react-hot-loader/isReactClassish.js?");

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	eval("var isReactClassish = __webpack_require__(22);\n\nfunction isReactElementish(obj, React) {\n  if (!obj) {\n    return false;\n  }\n\n  return Object.prototype.toString.call(obj.props) === '[object Object]' &&\n         isReactClassish(obj.type, React);\n}\n\nmodule.exports = isReactElementish;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/react-hot-loader/isReactElementish.js\n ** module id = 23\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/react-hot-loader/isReactElementish.js?");

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	eval("/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(2), RootInstanceProvider = __webpack_require__(10), ReactMount = __webpack_require__(12), React = __webpack_require__(13); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {\n\n\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nexports.RoutedApp = exports.routes = undefined;\n\nvar _components = __webpack_require__(25);\n\nvar _components2 = _interopRequireDefault(_components);\n\nvar _reactRouter = __webpack_require__(26);\n\nvar _react = __webpack_require__(13);\n\nvar _react2 = _interopRequireDefault(_react);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar routes = exports.routes = _react2.default.createElement(\n\t_reactRouter.Route,\n\t{ component: _components2.default.HackerNews, path: \"/\" },\n\t_react2.default.createElement(_reactRouter.IndexRoute, { component: _components2.default.ItemListView }),\n\t_react2.default.createElement(_reactRouter.Route, { component: _components2.default.ItemListView, path: \"asks\" }),\n\t_react2.default.createElement(_reactRouter.Route, { component: _components2.default.ItemListView, path: \"shows\" }),\n\t_react2.default.createElement(_reactRouter.Route, { component: _components2.default.ItemListView, path: \"latest\" }),\n\t_react2.default.createElement(_reactRouter.Route, { component: _components2.default.ItemDetailView, path: \"i/:id\" })\n);\n\nvar RoutedApp = exports.RoutedApp = _react2.default.createElement(\n\t_reactRouter.Router,\n\t{ history: _reactRouter.browserHistory },\n\troutes\n);\n\n/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(21); if (makeExportsHot(module, __webpack_require__(13))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error(\"Cannot not apply hot update to \" + \"routes.js\" + \": \" + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/routes.js\n ** module id = 24\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/routes.js?");

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	eval("/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(2), RootInstanceProvider = __webpack_require__(10), ReactMount = __webpack_require__(12), React = __webpack_require__(13); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {\n\n'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(13);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRouter = __webpack_require__(26);\n\nvar _reactRedux = __webpack_require__(27);\n\nvar _actionTypes = __webpack_require__(20);\n\nvar actionTypes = _interopRequireWildcard(_actionTypes);\n\nvar _actions = __webpack_require__(28);\n\nvar actions = _interopRequireWildcard(_actions);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nfunction mapStateToProps(state) {\n\treturn state;\n}\n\nfunction mapDispatchToProps(dispatch) {\n\treturn {\n\t\tinvalidateStories: function invalidateStories(force) {\n\t\t\tdispatch(actions.invalidateContent(\"story\", force));\n\t\t},\n\t\tinvalidateAsks: function invalidateAsks(force) {\n\t\t\tdispatch(actions.invalidateContent(\"ask\", force));\n\t\t},\n\t\tinvalidateShows: function invalidateShows(force) {\n\t\t\tdispatch(actions.invalidateContent(\"show\", force));\n\t\t},\n\t\tinvalidateLatest: function invalidateLatest(force) {\n\t\t\tdispatch(actions.invalidateContent(\"latest\", force));\n\t\t},\n\t\tviewItemDetail: function viewItemDetail(id) {\n\t\t\tdispatch(actions.viewItemDetail(id));\n\t\t},\n\t\tviewComments: function viewComments(commentIds) {\n\t\t\tdispatch(actions.viewComments(commentIds));\n\t\t}\n\t};\n}\n\nvar connectToStore = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps);\n\nvar HackerNews = function (_React$Component) {\n\t_inherits(HackerNews, _React$Component);\n\n\tfunction HackerNews() {\n\t\t_classCallCheck(this, HackerNews);\n\n\t\treturn _possibleConstructorReturn(this, Object.getPrototypeOf(HackerNews).apply(this, arguments));\n\t}\n\n\t_createClass(HackerNews, [{\n\t\tkey: 'render',\n\t\tvalue: function render() {\n\t\t\treturn _react2.default.createElement(\n\t\t\t\t'div',\n\t\t\t\tnull,\n\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t'div',\n\t\t\t\t\t{ className: 'row' },\n\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t'div',\n\t\t\t\t\t\t{ className: 'col s12' },\n\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t'span',\n\t\t\t\t\t\t\tnull,\n\t\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t\t'i',\n\t\t\t\t\t\t\t\t{ className: 'material-icons hn-link', style: { 'fontSize': '13pt' }, onClick: this._onRefreshStories.bind(this) },\n\t\t\t\t\t\t\t\t'loop'\n\t\t\t\t\t\t\t),\n\t\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t\t'span',\n\t\t\t\t\t\t\t\tnull,\n\t\t\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t\t\t_reactRouter.IndexLink,\n\t\t\t\t\t\t\t\t\t{ to: '/', style: { color: 'black', 'fontSize': '20pt' } },\n\t\t\t\t\t\t\t\t\t'My Hacker News'\n\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t),\n\t\t\t\t\t\t\t'  ',\n\t\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t\t'span',\n\t\t\t\t\t\t\t\t{ className: 'hn-link hn-text-black' },\n\t\t\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t\t\t_reactRouter.Link,\n\t\t\t\t\t\t\t\t\t{ activeClassName: 'hn-active-page', to: '/latest' },\n\t\t\t\t\t\t\t\t\t'New'\n\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t),\n\t\t\t\t\t\t\t'  ',\n\t\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t\t'span',\n\t\t\t\t\t\t\t\t{ className: 'hn-link hn-text-black' },\n\t\t\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t\t\t_reactRouter.Link,\n\t\t\t\t\t\t\t\t\t{ activeClassName: 'hn-active-page', to: '/asks' },\n\t\t\t\t\t\t\t\t\t'Ask'\n\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t),\n\t\t\t\t\t\t\t'  ',\n\t\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t\t'span',\n\t\t\t\t\t\t\t\t{ className: 'hn-link hn-text-black' },\n\t\t\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t\t\t_reactRouter.Link,\n\t\t\t\t\t\t\t\t\t{ activeClassName: 'hn-active-page', to: '/shows' },\n\t\t\t\t\t\t\t\t\t'Show'\n\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t)\n\t\t\t\t\t\t)\n\t\t\t\t\t)\n\t\t\t\t),\n\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t'div',\n\t\t\t\t\t{ className: 'row' },\n\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t'div',\n\t\t\t\t\t\t{ className: 'col s12' },\n\t\t\t\t\t\tthis.props.children\n\t\t\t\t\t)\n\t\t\t\t)\n\t\t\t);\n\t\t}\n\t}, {\n\t\tkey: '_onRefreshStories',\n\t\tvalue: function _onRefreshStories() {\n\t\t\tvar path = this.props.location.pathname;\n\n\n\t\t\tif (path.indexOf(\"/i\") === 0) this.props.viewItemDetail(this.props.params.id);else if (path.indexOf(\"/asks\") === 0) this.props.invalidateAsks(true);else if (path.indexOf(\"/shows\") === 0) this.props.invalidateShows(true);else if (path.indexOf(\"/latest\") === 0) this.props.invalidateLatest(true);else if (path === \"/\") this.props.invalidateStories(true);\n\t\t}\n\t}]);\n\n\treturn HackerNews;\n}(_react2.default.Component);\n\nvar ItemListView = function (_React$Component2) {\n\t_inherits(ItemListView, _React$Component2);\n\n\tfunction ItemListView() {\n\t\t_classCallCheck(this, ItemListView);\n\n\t\treturn _possibleConstructorReturn(this, Object.getPrototypeOf(ItemListView).apply(this, arguments));\n\t}\n\n\t_createClass(ItemListView, [{\n\t\tkey: 'render',\n\t\tvalue: function render() {\n\t\t\tvar _this3 = this;\n\n\t\t\tvar itemList = [];\n\n\t\t\tswitch (this.props.location.pathname) {\n\t\t\t\tcase \"/\":\n\t\t\t\t\titemList = this.props.stories.data;break;\n\t\t\t\tcase \"/asks\":\n\t\t\t\t\titemList = this.props.asks.data;break;\n\t\t\t\tcase \"/shows\":\n\t\t\t\t\titemList = this.props.shows.data;break;\n\t\t\t\tcase \"/latest\":\n\t\t\t\t\titemList = this.props.latest.data;break;\n\t\t\t}\n\n\t\t\tvar itemEleList = itemList.map(function (item) {\n\t\t\t\treturn _react2.default.createElement(Item, { item: item, key: item.id, viewItemDetail: _this3.props.viewItemDetail, location: _this3.props.location });\n\t\t\t});\n\n\t\t\treturn _react2.default.createElement(\n\t\t\t\t'div',\n\t\t\t\tnull,\n\t\t\t\titemEleList\n\t\t\t);\n\t\t}\n\t}, {\n\t\tkey: 'componentDidMount',\n\t\tvalue: function componentDidMount() {\n\t\t\tthis._invalidateContentIfNeeded(this.props.location.pathname);\n\t\t}\n\t}, {\n\t\tkey: 'componentWillReceiveProps',\n\t\tvalue: function componentWillReceiveProps(newProps) {\n\n\t\t\tif (newProps.location.pathname !== this.props.location.pathname) {\n\t\t\t\tthis._invalidateContentIfNeeded(newProps.location.pathname);\n\t\t\t}\n\t\t}\n\t}, {\n\t\tkey: '_invalidateContentIfNeeded',\n\t\tvalue: function _invalidateContentIfNeeded(pathname) {\n\n\t\t\tswitch (pathname) {\n\t\t\t\tcase \"/\":\n\t\t\t\t\tthis.props.invalidateStories(false);break;\n\t\t\t\tcase \"/asks\":\n\t\t\t\t\tthis.props.invalidateAsks(false);break;\n\t\t\t\tcase \"/shows\":\n\t\t\t\t\tthis.props.invalidateShows(false);break;\n\t\t\t\tcase \"/latest\":\n\t\t\t\t\tthis.props.invalidateLatest(false);break;\n\t\t\t}\n\t\t}\n\t}]);\n\n\treturn ItemListView;\n}(_react2.default.Component);\n\nvar _ref = _react2.default.createElement('div', null);\n\nvar Item = function (_React$Component3) {\n\t_inherits(Item, _React$Component3);\n\n\tfunction Item() {\n\t\t_classCallCheck(this, Item);\n\n\t\treturn _possibleConstructorReturn(this, Object.getPrototypeOf(Item).apply(this, arguments));\n\t}\n\n\t_createClass(Item, [{\n\t\tkey: 'render',\n\t\tvalue: function render() {\n\t\t\tvar _props = this.props;\n\t\t\tvar item = _props.item;\n\t\t\tvar pathname = _props.location.pathname;\n\n\t\t\tvar itemText = _ref;\n\t\t\tvar itemLink = null;\n\n\t\t\tif (pathname.indexOf(\"/i\") === 0) itemText = _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: item.text }, className: 'hn-text-black' });\n\n\t\t\tif (item.url) itemLink = _react2.default.createElement(\n\t\t\t\t'a',\n\t\t\t\t{ className: 'hn-story-card-title', href: item.url, target: '_blank' },\n\t\t\t\titem.title\n\t\t\t);else itemLink = _react2.default.createElement(\n\t\t\t\t'span',\n\t\t\t\t{ className: 'hn-story-card-title hn-link hn-text-black' },\n\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t_reactRouter.Link,\n\t\t\t\t\t{ to: '/i/' + item.id },\n\t\t\t\t\titem.title\n\t\t\t\t)\n\t\t\t);\n\n\t\t\treturn _react2.default.createElement(\n\t\t\t\t'div',\n\t\t\t\t{ className: 'card blue-grey lighten-4' },\n\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t'div',\n\t\t\t\t\t{ className: 'card-content white-text' },\n\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t'div',\n\t\t\t\t\t\tnull,\n\t\t\t\t\t\titemLink,\n\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t'span',\n\t\t\t\t\t\t\t{ className: 'hn-story-sec-text' },\n\t\t\t\t\t\t\t'   ',\n\t\t\t\t\t\t\titem.score,\n\t\t\t\t\t\t\t' points'\n\t\t\t\t\t\t),\n\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t'span',\n\t\t\t\t\t\t\t{ className: 'hn-story-sec-text hn-link' },\n\t\t\t\t\t\t\t' by ',\n\t\t\t\t\t\t\titem.by\n\t\t\t\t\t\t),\n\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t'span',\n\t\t\t\t\t\t\tnull,\n\t\t\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\t\t_reactRouter.Link,\n\t\t\t\t\t\t\t\t{ to: '/i/' + item.id, className: 'hn-story-sec-text hn-link' },\n\t\t\t\t\t\t\t\t'  | ',\n\t\t\t\t\t\t\t\titem.descendants + ' comments'\n\t\t\t\t\t\t\t)\n\t\t\t\t\t\t),\n\t\t\t\t\t\titemText\n\t\t\t\t\t)\n\t\t\t\t)\n\t\t\t);\n\t\t}\n\t}]);\n\n\treturn Item;\n}(_react2.default.Component);\n\nvar _ref2 = _react2.default.createElement('div', null);\n\nvar ItemDetailView = function (_React$Component4) {\n\t_inherits(ItemDetailView, _React$Component4);\n\n\tfunction ItemDetailView() {\n\t\t_classCallCheck(this, ItemDetailView);\n\n\t\treturn _possibleConstructorReturn(this, Object.getPrototypeOf(ItemDetailView).apply(this, arguments));\n\t}\n\n\t_createClass(ItemDetailView, [{\n\t\tkey: 'render',\n\t\tvalue: function render() {\n\t\t\tvar _props2 = this.props;\n\t\t\tvar itemDetail = _props2.itemDetail;\n\t\t\tvar comments = _props2.comments;\n\t\t\tvar viewComments = _props2.viewComments;\n\n\n\t\t\tif (itemDetail.invalidated) return _ref2;else return _react2.default.createElement(\n\t\t\t\t'div',\n\t\t\t\tnull,\n\t\t\t\t_react2.default.createElement(Item, { item: itemDetail.item, viewItemDetail: this.props.viewItemDetail, location: this.props.location }),\n\t\t\t\t_react2.default.createElement(CommentList, { comments: comments, parent: itemDetail.item, key: itemDetail.item.id, viewComments: viewComments })\n\t\t\t);\n\t\t}\n\t}, {\n\t\tkey: 'componentDidMount',\n\t\tvalue: function componentDidMount() {\n\t\t\tvar _props3 = this.props;\n\t\t\tvar id = _props3.params.id;\n\t\t\tvar viewItemDetail = _props3.viewItemDetail;\n\n\t\t\tviewItemDetail(id);\n\t\t}\n\t}]);\n\n\treturn ItemDetailView;\n}(_react2.default.Component);\n\nvar CommentList = function (_React$Component5) {\n\t_inherits(CommentList, _React$Component5);\n\n\tfunction CommentList() {\n\t\t_classCallCheck(this, CommentList);\n\n\t\treturn _possibleConstructorReturn(this, Object.getPrototypeOf(CommentList).apply(this, arguments));\n\t}\n\n\t_createClass(CommentList, [{\n\t\tkey: 'render',\n\t\tvalue: function render() {\n\t\t\tvar _props4 = this.props;\n\t\t\tvar comments = _props4.comments;\n\t\t\tvar parent = _props4.parent;\n\t\t\tvar viewComments = _props4.viewComments;\n\n\t\t\t//console.log(\"CommentList:beforeFilter \"+comments.length);\n\n\t\t\tvar storyComments = [];\n\n\t\t\tif (parent.kids && parent.kids.length > 0) {\n\t\t\t\tcomments.forEach(function (comment) {\n\t\t\t\t\tvar i = parent.kids.indexOf(comment.id);\n\t\t\t\t\tif (i >= 0) storyComments[i] = comment;\n\t\t\t\t});\n\t\t\t}\n\n\t\t\t//console.log(\"CommentList:afterFilter \"+storyComments.length);\n\n\t\t\tif (storyComments.length === 0) return null;\n\n\t\t\tvar commentEles = storyComments.map(function (comment) {\n\t\t\t\treturn _react2.default.createElement(CommentItem, { comment: comment, key: comment.id, allComments: comments, viewComments: viewComments });\n\t\t\t});\n\n\t\t\treturn _react2.default.createElement(\n\t\t\t\t'ul',\n\t\t\t\t{ className: 'collection' },\n\t\t\t\tcommentEles\n\t\t\t);\n\t\t}\n\t}]);\n\n\treturn CommentList;\n}(_react2.default.Component);\n\nvar CommentItem = function (_React$Component6) {\n\t_inherits(CommentItem, _React$Component6);\n\n\tfunction CommentItem() {\n\t\t_classCallCheck(this, CommentItem);\n\n\t\treturn _possibleConstructorReturn(this, Object.getPrototypeOf(CommentItem).apply(this, arguments));\n\t}\n\n\t_createClass(CommentItem, [{\n\t\tkey: 'render',\n\t\tvalue: function render() {\n\t\t\tvar _props5 = this.props;\n\t\t\tvar comment = _props5.comment;\n\t\t\tvar allComments = _props5.allComments;\n\t\t\tvar viewComments = _props5.viewComments;\n\n\t\t\tvar noOfReplies = comment.kids ? comment.kids.length : 0;\n\t\t\treturn _react2.default.createElement(\n\t\t\t\t'li',\n\t\t\t\t{ className: 'collection-item blue-grey lighten-4 hn-comment-box' },\n\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t'div',\n\t\t\t\t\tnull,\n\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t'span',\n\t\t\t\t\t\t{ className: 'hn-story-sec-text' },\n\t\t\t\t\t\tcomment.by,\n\t\t\t\t\t\t'   '\n\t\t\t\t\t),\n\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t'span',\n\t\t\t\t\t\t{ className: 'hn-story-sec-text hn-link', disabled: noOfReplies === 0, onClick: this._viewChildComments.bind(this) },\n\t\t\t\t\t\tnoOfReplies,\n\t\t\t\t\t\t' replies'\n\t\t\t\t\t)\n\t\t\t\t),\n\t\t\t\t_react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: comment.text } }),\n\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t'div',\n\t\t\t\t\tnull,\n\t\t\t\t\t_react2.default.createElement(CommentList, { comments: allComments, parent: comment, key: comment.id, viewComments: viewComments })\n\t\t\t\t)\n\t\t\t);\n\t\t}\n\t}, {\n\t\tkey: '_viewChildComments',\n\t\tvalue: function _viewChildComments() {\n\t\t\tvar _props6 = this.props;\n\t\t\tvar comment = _props6.comment;\n\t\t\tvar viewComments = _props6.viewComments;\n\n\t\t\tif (comment.kids && comment.kids.length > 0) {\n\t\t\t\tviewComments(comment.kids);\n\t\t\t}\n\t\t}\n\t}]);\n\n\treturn CommentItem;\n}(_react2.default.Component);\n\nexports.default = {\n\tHackerNews: connectToStore(HackerNews),\n\tItemListView: connectToStore(ItemListView),\n\tItemDetailView: connectToStore(ItemDetailView)\n};\n\n/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(21); if (makeExportsHot(module, __webpack_require__(13))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error(\"Cannot not apply hot update to \" + \"components.js\" + \": \" + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/components.js\n ** module id = 25\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/components.js?");

/***/ },
/* 26 */
/***/ function(module, exports) {

	eval("module.exports = require(\"react-router\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"react-router\"\n ** module id = 26\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22react-router%22?");

/***/ },
/* 27 */
/***/ function(module, exports) {

	eval("module.exports = require(\"react-redux\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"react-redux\"\n ** module id = 27\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22react-redux%22?");

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	eval("/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(2), RootInstanceProvider = __webpack_require__(10), ReactMount = __webpack_require__(12), React = __webpack_require__(13); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {\n\n'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nexports.invalidateContent = invalidateContent;\nexports.viewItemDetail = viewItemDetail;\nexports.viewComments = viewComments;\n\nvar _dataFetcher = __webpack_require__(29);\n\nvar fetcher = _interopRequireWildcard(_dataFetcher);\n\nvar _actionTypes = __webpack_require__(20);\n\nvar actionTypes = _interopRequireWildcard(_actionTypes);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nvar COMMENT_LOAD_BATCH_SIZE = 5;\nvar MAIN_STORY_LIST_SIZE = 30;\nvar STORY_LOAD_BATCH_SIZE = 5;\n\nvar STORY_CACHE_EXPIRY_MIN = 1;\n\nfunction invalidateContent(contentType, force) {\n\n\treturn function (dispatch, getState) {\n\n\t\tvar now = Date.now();\n\t\tvar content = null,\n\t\t    actionType = null,\n\t\t    fetchAction = null,\n\t\t    refreshActionType = null;\n\n\t\tswitch (contentType) {\n\t\t\tcase \"story\":\n\t\t\t\tcontent = getState().stories;\n\t\t\t\tactionType = actionTypes.INVALIDATE_STORIES;\n\t\t\t\trefreshActionType = actionTypes.REFRESH_STORIES;\n\t\t\t\tfetchAction = fetcher.fetchTopStories;\n\t\t\t\tbreak;\n\t\t\tcase \"ask\":\n\t\t\t\tcontent = getState().asks;\n\t\t\t\tactionType = actionTypes.INVALIDATE_ASKS;\n\t\t\t\trefreshActionType = actionTypes.REFRESH_ASKS;\n\t\t\t\tfetchAction = fetcher.fetchTopAsks;\n\t\t\t\tbreak;\n\t\t\tcase \"show\":\n\t\t\t\tcontent = getState().shows;\n\t\t\t\tactionType = actionTypes.INVALIDATE_SHOWS;\n\t\t\t\trefreshActionType = actionTypes.REFRESH_SHOWS;\n\t\t\t\tfetchAction = fetcher.fetchTopShows;\n\t\t\t\tbreak;\n\t\t\tcase \"latest\":\n\t\t\t\tcontent = getState().latest;\n\t\t\t\tactionType = actionTypes.INVALIDATE_LATEST;\n\t\t\t\trefreshActionType = actionTypes.REFRESH_LATEST;\n\t\t\t\tfetchAction = fetcher.fetchLatest;\n\t\t\t\tbreak;\n\t\t}\n\n\t\tvar lastRefresh = content.lastRefresh;\n\n\t\tif (force || now > lastRefresh + STORY_CACHE_EXPIRY_MIN * 60 * 1000) {\n\n\t\t\tdispatch({\n\t\t\t\ttype: actionType,\n\t\t\t\tlastRefresh: Date.now()\n\t\t\t});\n\n\t\t\tfetchAction().then(function (ids) {\n\n\t\t\t\tloadContentAsync(ids.splice(0, MAIN_STORY_LIST_SIZE), dispatch, refreshActionType);\n\t\t\t});\n\t\t}\n\t};\n}\n\nfunction loadContentAsync(ids, dispatch, refreshActionType) {\n\n\tif (ids.length > 0) {\n\t\tvar idBatch = ids.splice(0, STORY_LOAD_BATCH_SIZE);\n\n\t\tfetcher.fetchItems(idBatch).then(function (items) {\n\t\t\tdispatch({\n\t\t\t\ttype: refreshActionType,\n\t\t\t\tdata: items,\n\t\t\t\tlastRefresh: Date.now()\n\t\t\t});\n\n\t\t\tloadContentAsync(ids, dispatch, refreshActionType);\n\t\t});\n\t}\n}\n\nfunction viewItemDetail(id) {\n\treturn function (dispatch, getState) {\n\t\tdispatch({\n\t\t\ttype: actionTypes.VIEW_ITEM_DETAIL\n\t\t});\n\n\t\tfetcher.fetchItems([id]).then(function (items) {\n\t\t\tvar item = items[0];\n\n\t\t\tdispatch({\n\t\t\t\ttype: actionTypes.REFRESH_ITEM_DETAIL,\n\t\t\t\tdata: item\n\t\t\t});\n\n\t\t\treturn item;\n\t\t}).then(function (item) {\n\n\t\t\tdispatch(viewComments(item.kids));\n\t\t});\n\t};\n}\n\nfunction viewComments(commentIds) {\n\treturn function (dispatch, getState) {\n\n\t\tvar loadedIds = getState().comments.map(function (comment) {\n\t\t\treturn comment.id;\n\t\t});\n\t\tvar toLoadIds = commentIds.filter(function (cid) {\n\t\t\treturn loadedIds.indexOf(cid) < 0;\n\t\t});\n\n\t\tif (toLoadIds.length > 0) {\n\t\t\t// fetcher.fetchComments(toLoadIds).then(function(comments){\n\t\t\t// \tdispatch({\n\t\t\t// \t\ttype: actionTypes.PUSH_COMMENTS,\n\t\t\t// \t\tcomments: comments\n\t\t\t// \t});\n\t\t\t// })\n\n\t\t\tloadCommentsAsync(toLoadIds, dispatch);\n\t\t}\n\t};\n}\n\nfunction loadCommentsAsync(commentIds, dispatch) {\n\tif (commentIds.length > 0) {\n\t\tvar idBatch = commentIds.splice(0, COMMENT_LOAD_BATCH_SIZE);\n\n\t\tfetcher.fetchComments(idBatch).then(function (comments) {\n\t\t\tdispatch({\n\t\t\t\ttype: actionTypes.PUSH_COMMENTS,\n\t\t\t\tcomments: comments\n\t\t\t});\n\t\t\tloadCommentsAsync(commentIds, dispatch);\n\t\t});\n\t}\n}\n\n/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(21); if (makeExportsHot(module, __webpack_require__(13))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error(\"Cannot not apply hot update to \" + \"actions.js\" + \": \" + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/actions.js\n ** module id = 28\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/actions.js?");

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	eval("/* WEBPACK VAR INJECTION */(function(module, fetch) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(2), RootInstanceProvider = __webpack_require__(10), ReactMount = __webpack_require__(12), React = __webpack_require__(13); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {\n\n\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nexports.fetchTopStories = fetchTopStories;\nexports.fetchTopAsks = fetchTopAsks;\nexports.fetchTopShows = fetchTopShows;\nexports.fetchLatest = fetchLatest;\nexports.fetchItems = fetchItems;\nexports.fetchComments = fetchComments;\n\nvar _q = __webpack_require__(32);\n\nvar _q2 = _interopRequireDefault(_q);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar TOP_STORIES_URL = \"https://hacker-news.firebaseio.com/v0/topstories.json\";\nvar STORIES_DETAIL_URL = \"https://hacker-news.firebaseio.com/v0/item/:id.json\";\nvar TOP_ASKS_URL = \"https://hacker-news.firebaseio.com/v0/askstories.json\";\nvar TOP_SHOWS_URL = \"https://hacker-news.firebaseio.com/v0/showstories.json\";\nvar NEW_STORIES_URL = \"https://hacker-news.firebaseio.com/v0/newstories.json\";\n\nvar noCacheHeader = {\n\t\"Cache-Control\": \"no-cache\"\n};\n\nfunction fetchTopStories() {\n\treturn fetch(TOP_STORIES_URL, { headers: noCacheHeader }).then(function (res) {\n\t\treturn res.json();\n\t});\n}\n\nfunction fetchTopAsks() {\n\treturn fetch(TOP_ASKS_URL, { headers: noCacheHeader }).then(function (res) {\n\t\treturn res.json();\n\t});\n}\n\nfunction fetchTopShows() {\n\treturn fetch(TOP_SHOWS_URL, { headers: noCacheHeader }).then(function (res) {\n\t\treturn res.json();\n\t});\n}\n\nfunction fetchLatest() {\n\treturn fetch(NEW_STORIES_URL, { headers: noCacheHeader }).then(function (res) {\n\t\treturn res.json();\n\t});\n}\n\nfunction fetchItems(ids) {\n\tvar fetchRequests = [];\n\tvar _iteratorNormalCompletion = true;\n\tvar _didIteratorError = false;\n\tvar _iteratorError = undefined;\n\n\ttry {\n\t\tfor (var _iterator = ids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n\t\t\tvar id = _step.value;\n\n\t\t\tfetchRequests.push(fetch(STORIES_DETAIL_URL.replace(\":id\", id), { headers: noCacheHeader }));\n\t\t}\n\t} catch (err) {\n\t\t_didIteratorError = true;\n\t\t_iteratorError = err;\n\t} finally {\n\t\ttry {\n\t\t\tif (!_iteratorNormalCompletion && _iterator.return) {\n\t\t\t\t_iterator.return();\n\t\t\t}\n\t\t} finally {\n\t\t\tif (_didIteratorError) {\n\t\t\t\tthrow _iteratorError;\n\t\t\t}\n\t\t}\n\t}\n\n\treturn _q2.default.all(fetchRequests).then(function (resps) {\n\t\tvar jsonPromises = [];\n\t\tvar _iteratorNormalCompletion2 = true;\n\t\tvar _didIteratorError2 = false;\n\t\tvar _iteratorError2 = undefined;\n\n\t\ttry {\n\t\t\tfor (var _iterator2 = resps[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {\n\t\t\t\tvar res = _step2.value;\n\n\t\t\t\tjsonPromises.push(res.json());\n\t\t\t}\n\t\t} catch (err) {\n\t\t\t_didIteratorError2 = true;\n\t\t\t_iteratorError2 = err;\n\t\t} finally {\n\t\t\ttry {\n\t\t\t\tif (!_iteratorNormalCompletion2 && _iterator2.return) {\n\t\t\t\t\t_iterator2.return();\n\t\t\t\t}\n\t\t\t} finally {\n\t\t\t\tif (_didIteratorError2) {\n\t\t\t\t\tthrow _iteratorError2;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\treturn _q2.default.all(jsonPromises);\n\t});\n}\n\nfunction fetchComments(commentIds) {\n\tvar fetchRequests = [];\n\tvar _iteratorNormalCompletion3 = true;\n\tvar _didIteratorError3 = false;\n\tvar _iteratorError3 = undefined;\n\n\ttry {\n\t\tfor (var _iterator3 = commentIds[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {\n\t\t\tvar cid = _step3.value;\n\n\t\t\tfetchRequests.push(fetch(STORIES_DETAIL_URL.replace(\":id\", cid), { headers: noCacheHeader }));\n\t\t}\n\t} catch (err) {\n\t\t_didIteratorError3 = true;\n\t\t_iteratorError3 = err;\n\t} finally {\n\t\ttry {\n\t\t\tif (!_iteratorNormalCompletion3 && _iterator3.return) {\n\t\t\t\t_iterator3.return();\n\t\t\t}\n\t\t} finally {\n\t\t\tif (_didIteratorError3) {\n\t\t\t\tthrow _iteratorError3;\n\t\t\t}\n\t\t}\n\t}\n\n\treturn _q2.default.all(fetchRequests).then(function (resps) {\n\n\t\tvar jsonPromises = [];\n\t\tvar _iteratorNormalCompletion4 = true;\n\t\tvar _didIteratorError4 = false;\n\t\tvar _iteratorError4 = undefined;\n\n\t\ttry {\n\t\t\tfor (var _iterator4 = resps[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {\n\t\t\t\tvar res = _step4.value;\n\n\t\t\t\tjsonPromises.push(res.json());\n\t\t\t}\n\t\t} catch (err) {\n\t\t\t_didIteratorError4 = true;\n\t\t\t_iteratorError4 = err;\n\t\t} finally {\n\t\t\ttry {\n\t\t\t\tif (!_iteratorNormalCompletion4 && _iterator4.return) {\n\t\t\t\t\t_iterator4.return();\n\t\t\t\t}\n\t\t\t} finally {\n\t\t\t\tif (_didIteratorError4) {\n\t\t\t\t\tthrow _iteratorError4;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\treturn _q2.default.all(jsonPromises);\n\t}).then(function (jsons) {\n\t\tjsons = jsons.filter(function (json) {\n\t\t\treturn !json.deleted;\n\t\t});\n\t\treturn jsons;\n\t});\n}\n\n/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(21); if (makeExportsHot(module, __webpack_require__(13))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error(\"Cannot not apply hot update to \" + \"dataFetcher.js\" + \": \" + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module), __webpack_require__(30)))\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/dataFetcher.js\n ** module id = 29\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/dataFetcher.js?");

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	eval("/* WEBPACK VAR INJECTION */(function(Promise) {/*** IMPORTS FROM imports-loader ***/\n(function() {\n\n(function(self) {\n  'use strict';\n\n  if (self.fetch) {\n    return\n  }\n\n  function normalizeName(name) {\n    if (typeof name !== 'string') {\n      name = String(name)\n    }\n    if (/[^a-z0-9\\-#$%&'*+.\\^_`|~]/i.test(name)) {\n      throw new TypeError('Invalid character in header field name')\n    }\n    return name.toLowerCase()\n  }\n\n  function normalizeValue(value) {\n    if (typeof value !== 'string') {\n      value = String(value)\n    }\n    return value\n  }\n\n  function Headers(headers) {\n    this.map = {}\n\n    if (headers instanceof Headers) {\n      headers.forEach(function(value, name) {\n        this.append(name, value)\n      }, this)\n\n    } else if (headers) {\n      Object.getOwnPropertyNames(headers).forEach(function(name) {\n        this.append(name, headers[name])\n      }, this)\n    }\n  }\n\n  Headers.prototype.append = function(name, value) {\n    name = normalizeName(name)\n    value = normalizeValue(value)\n    var list = this.map[name]\n    if (!list) {\n      list = []\n      this.map[name] = list\n    }\n    list.push(value)\n  }\n\n  Headers.prototype['delete'] = function(name) {\n    delete this.map[normalizeName(name)]\n  }\n\n  Headers.prototype.get = function(name) {\n    var values = this.map[normalizeName(name)]\n    return values ? values[0] : null\n  }\n\n  Headers.prototype.getAll = function(name) {\n    return this.map[normalizeName(name)] || []\n  }\n\n  Headers.prototype.has = function(name) {\n    return this.map.hasOwnProperty(normalizeName(name))\n  }\n\n  Headers.prototype.set = function(name, value) {\n    this.map[normalizeName(name)] = [normalizeValue(value)]\n  }\n\n  Headers.prototype.forEach = function(callback, thisArg) {\n    Object.getOwnPropertyNames(this.map).forEach(function(name) {\n      this.map[name].forEach(function(value) {\n        callback.call(thisArg, value, name, this)\n      }, this)\n    }, this)\n  }\n\n  function consumed(body) {\n    if (body.bodyUsed) {\n      return Promise.reject(new TypeError('Already read'))\n    }\n    body.bodyUsed = true\n  }\n\n  function fileReaderReady(reader) {\n    return new Promise(function(resolve, reject) {\n      reader.onload = function() {\n        resolve(reader.result)\n      }\n      reader.onerror = function() {\n        reject(reader.error)\n      }\n    })\n  }\n\n  function readBlobAsArrayBuffer(blob) {\n    var reader = new FileReader()\n    reader.readAsArrayBuffer(blob)\n    return fileReaderReady(reader)\n  }\n\n  function readBlobAsText(blob) {\n    var reader = new FileReader()\n    reader.readAsText(blob)\n    return fileReaderReady(reader)\n  }\n\n  var support = {\n    blob: 'FileReader' in self && 'Blob' in self && (function() {\n      try {\n        new Blob();\n        return true\n      } catch(e) {\n        return false\n      }\n    })(),\n    formData: 'FormData' in self,\n    arrayBuffer: 'ArrayBuffer' in self\n  }\n\n  function Body() {\n    this.bodyUsed = false\n\n\n    this._initBody = function(body) {\n      this._bodyInit = body\n      if (typeof body === 'string') {\n        this._bodyText = body\n      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {\n        this._bodyBlob = body\n      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {\n        this._bodyFormData = body\n      } else if (!body) {\n        this._bodyText = ''\n      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {\n        // Only support ArrayBuffers for POST method.\n        // Receiving ArrayBuffers happens via Blobs, instead.\n      } else {\n        throw new Error('unsupported BodyInit type')\n      }\n\n      if (!this.headers.get('content-type')) {\n        if (typeof body === 'string') {\n          this.headers.set('content-type', 'text/plain;charset=UTF-8')\n        } else if (this._bodyBlob && this._bodyBlob.type) {\n          this.headers.set('content-type', this._bodyBlob.type)\n        }\n      }\n    }\n\n    if (support.blob) {\n      this.blob = function() {\n        var rejected = consumed(this)\n        if (rejected) {\n          return rejected\n        }\n\n        if (this._bodyBlob) {\n          return Promise.resolve(this._bodyBlob)\n        } else if (this._bodyFormData) {\n          throw new Error('could not read FormData body as blob')\n        } else {\n          return Promise.resolve(new Blob([this._bodyText]))\n        }\n      }\n\n      this.arrayBuffer = function() {\n        return this.blob().then(readBlobAsArrayBuffer)\n      }\n\n      this.text = function() {\n        var rejected = consumed(this)\n        if (rejected) {\n          return rejected\n        }\n\n        if (this._bodyBlob) {\n          return readBlobAsText(this._bodyBlob)\n        } else if (this._bodyFormData) {\n          throw new Error('could not read FormData body as text')\n        } else {\n          return Promise.resolve(this._bodyText)\n        }\n      }\n    } else {\n      this.text = function() {\n        var rejected = consumed(this)\n        return rejected ? rejected : Promise.resolve(this._bodyText)\n      }\n    }\n\n    if (support.formData) {\n      this.formData = function() {\n        return this.text().then(decode)\n      }\n    }\n\n    this.json = function() {\n      return this.text().then(JSON.parse)\n    }\n\n    return this\n  }\n\n  // HTTP methods whose capitalization should be normalized\n  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']\n\n  function normalizeMethod(method) {\n    var upcased = method.toUpperCase()\n    return (methods.indexOf(upcased) > -1) ? upcased : method\n  }\n\n  function Request(input, options) {\n    options = options || {}\n    var body = options.body\n    if (Request.prototype.isPrototypeOf(input)) {\n      if (input.bodyUsed) {\n        throw new TypeError('Already read')\n      }\n      this.url = input.url\n      this.credentials = input.credentials\n      if (!options.headers) {\n        this.headers = new Headers(input.headers)\n      }\n      this.method = input.method\n      this.mode = input.mode\n      if (!body) {\n        body = input._bodyInit\n        input.bodyUsed = true\n      }\n    } else {\n      this.url = input\n    }\n\n    this.credentials = options.credentials || this.credentials || 'omit'\n    if (options.headers || !this.headers) {\n      this.headers = new Headers(options.headers)\n    }\n    this.method = normalizeMethod(options.method || this.method || 'GET')\n    this.mode = options.mode || this.mode || null\n    this.referrer = null\n\n    if ((this.method === 'GET' || this.method === 'HEAD') && body) {\n      throw new TypeError('Body not allowed for GET or HEAD requests')\n    }\n    this._initBody(body)\n  }\n\n  Request.prototype.clone = function() {\n    return new Request(this)\n  }\n\n  function decode(body) {\n    var form = new FormData()\n    body.trim().split('&').forEach(function(bytes) {\n      if (bytes) {\n        var split = bytes.split('=')\n        var name = split.shift().replace(/\\+/g, ' ')\n        var value = split.join('=').replace(/\\+/g, ' ')\n        form.append(decodeURIComponent(name), decodeURIComponent(value))\n      }\n    })\n    return form\n  }\n\n  function headers(xhr) {\n    var head = new Headers()\n    var pairs = xhr.getAllResponseHeaders().trim().split('\\n')\n    pairs.forEach(function(header) {\n      var split = header.trim().split(':')\n      var key = split.shift().trim()\n      var value = split.join(':').trim()\n      head.append(key, value)\n    })\n    return head\n  }\n\n  Body.call(Request.prototype)\n\n  function Response(bodyInit, options) {\n    if (!options) {\n      options = {}\n    }\n\n    this.type = 'default'\n    this.status = options.status\n    this.ok = this.status >= 200 && this.status < 300\n    this.statusText = options.statusText\n    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)\n    this.url = options.url || ''\n    this._initBody(bodyInit)\n  }\n\n  Body.call(Response.prototype)\n\n  Response.prototype.clone = function() {\n    return new Response(this._bodyInit, {\n      status: this.status,\n      statusText: this.statusText,\n      headers: new Headers(this.headers),\n      url: this.url\n    })\n  }\n\n  Response.error = function() {\n    var response = new Response(null, {status: 0, statusText: ''})\n    response.type = 'error'\n    return response\n  }\n\n  var redirectStatuses = [301, 302, 303, 307, 308]\n\n  Response.redirect = function(url, status) {\n    if (redirectStatuses.indexOf(status) === -1) {\n      throw new RangeError('Invalid status code')\n    }\n\n    return new Response(null, {status: status, headers: {location: url}})\n  }\n\n  self.Headers = Headers;\n  self.Request = Request;\n  self.Response = Response;\n\n  self.fetch = function(input, init) {\n    return new Promise(function(resolve, reject) {\n      var request\n      if (Request.prototype.isPrototypeOf(input) && !init) {\n        request = input\n      } else {\n        request = new Request(input, init)\n      }\n\n      var xhr = new XMLHttpRequest()\n\n      function responseURL() {\n        if ('responseURL' in xhr) {\n          return xhr.responseURL\n        }\n\n        // Avoid security warnings on getResponseHeader when not allowed by CORS\n        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {\n          return xhr.getResponseHeader('X-Request-URL')\n        }\n\n        return;\n      }\n\n      xhr.onload = function() {\n        var status = (xhr.status === 1223) ? 204 : xhr.status\n        if (status < 100 || status > 599) {\n          reject(new TypeError('Network request failed'))\n          return\n        }\n        var options = {\n          status: status,\n          statusText: xhr.statusText,\n          headers: headers(xhr),\n          url: responseURL()\n        }\n        var body = 'response' in xhr ? xhr.response : xhr.responseText;\n        resolve(new Response(body, options))\n      }\n\n      xhr.onerror = function() {\n        reject(new TypeError('Network request failed'))\n      }\n\n      xhr.open(request.method, request.url, true)\n\n      if (request.credentials === 'include') {\n        xhr.withCredentials = true\n      }\n\n      if ('responseType' in xhr && support.blob) {\n        xhr.responseType = 'blob'\n      }\n\n      request.headers.forEach(function(value, name) {\n        xhr.setRequestHeader(name, value)\n      })\n\n      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)\n    })\n  }\n  self.fetch.polyfill = true\n})(typeof self !== 'undefined' ? self : this);\n\n\n/*** EXPORTS FROM exports-loader ***/\nmodule.exports = global.fetch;\n}.call(global));\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(31)))\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/imports-loader?this=>global!./~/exports-loader?global.fetch!./~/whatwg-fetch/fetch.js\n ** module id = 30\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/whatwg-fetch/fetch.js?./~/imports-loader?this=%3Eglobal!./~/exports-loader?global.fetch");

/***/ },
/* 31 */
/***/ function(module, exports) {

	eval("module.exports = require(\"es6-promise\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"es6-promise\"\n ** module id = 31\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22es6-promise%22?");

/***/ },
/* 32 */
/***/ function(module, exports) {

	eval("module.exports = require(\"q\");\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"q\"\n ** module id = 32\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22q%22?");

/***/ }
/******/ ]);