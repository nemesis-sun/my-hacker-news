import * as actionTypes from "./actionTypes"

export function stories(state={invalidated: true, data: [], lastRefresh: 0}, action){
	if(action.type===actionTypes.INVALIDATE_STORIES){
		
		return {
			invalidated: true,
			data: [],
			lastRefresh: action.lastRefresh
		};
	} else if (action.type===actionTypes.REFRESH_STORIES){

		return {
			invalidated: false,
			data: state.data.concat(action.data),
			lastRefresh: action.lastRefresh
		};
	}

	return state;
}

export function itemDetail(state={invalidated: true, story: null}, action){
	if(action.type===actionTypes.VIEW_ITEM_DETAIL) {
		return {
			invalidated: true,
			item: null
		}
	} else if (action.type===actionTypes.REFRESH_ITEM_DETAIL) {
		return {
			invalidated: false,
			item: action.data
		}
	} 

	return state;
}

export function comments(state=[], action){

	if(action.type===actionTypes.VIEW_STORY_DETAIL) {
		console.log("reducer:comments:VIEW_STORY_DETAIL");
		return [];
	} else if(action.type===actionTypes.PUSH_COMMENTS) {
		console.log("reducer:comments:PUSH_COMMENTS");
		return state.concat(action.comments);
	}

	return state;
}

export function asks(state={invalidated: true, data: [], lastRefresh: 0}, action){

	if(action.type===actionTypes.INVALIDATE_ASKS){
		return {
			invalidated: true,
			data: [],
			lastRefresh: action.lastRefresh
		}
	} else if (action.type===actionTypes.REFRESH_ASKS){
		return {
			invalidated: false,
			data: state.data.concat(action.data),
			lastRefresh: action.lastRefresh
		};
	}

	return state;
}

export function shows(state={invalidated: true, data: [], lastRefresh: 0}, action){

	if(action.type===actionTypes.INVALIDATE_SHOWS){
		return {
			invalidated: true,
			data: [],
			lastRefresh: action.lastRefresh
		}
	} else if (action.type===actionTypes.REFRESH_SHOWS){
		return {
			invalidated: false,
			data: state.data.concat(action.data),
			lastRefresh: action.lastRefresh
		};
	}

	return state;
}

export function latest(state={invalidated: true, data: [], lastRefresh: 0}, action){

	if(action.type===actionTypes.INVALIDATE_LATEST){
		return {
			invalidated: true,
			data: [],
			lastRefresh: action.lastRefresh
		}
	} else if (action.type===actionTypes.REFRESH_LATEST){
		return {
			invalidated: false,
			data: state.data.concat(action.data),
			lastRefresh: action.lastRefresh
		};
	}

	return state;
}
