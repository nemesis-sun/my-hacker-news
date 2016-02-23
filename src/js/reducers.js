import * as actionTypes from "./actionTypes"

export function stories(state={invalidated: true, data: []}, action){
	if(action.type===actionTypes.INVALIDATE_STORIES){
		
		return {
			invalidated: true,
			data: []
		};
	} else if (action.type===actionTypes.REFRESH_STORIES){

		return {
			invalidated: false,
			data: action.data
		};
	}

	return state;
}

export function storyDetail(state={invalidated: true, story: null}, action){
	if(action.type===actionTypes.VIEW_STORY_DETAIL) {
		return {
			invalidated: true,
			story: null
		}
	} else if (action.type===actionTypes.REFRESH_STORY_DETAIL) {
		return {
			invalidated: false,
			story: action.data
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
