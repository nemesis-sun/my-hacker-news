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
