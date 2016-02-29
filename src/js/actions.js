import * as fetcher from './dataFetcher'
import * as actionTypes from './actionTypes'


const COMMENT_LOAD_BATCH_SIZE = 5;
const MAIN_STORY_LIST_SIZE = 30;
const STORY_LOAD_BATCH_SIZE = 5;

const STORY_CACHE_EXPIRY_MIN = 1;

export function invalidateContent(contentType, force){

	return function(dispatch, getState){

		let now = Date.now();
		let content = null, actionType = null, fetchAction = null, refreshActionType = null;
		
		switch(contentType){
			case "story": 
				content = getState().stories;
				actionType = actionTypes.INVALIDATE_STORIES;
				refreshActionType = actionTypes.REFRESH_STORIES;
				fetchAction = fetcher.fetchTopStories;
				break;
			case "ask":
				content = getState().asks;
				actionType = actionTypes.INVALIDATE_ASKS;
				refreshActionType = actionTypes.REFRESH_ASKS;
				fetchAction = fetcher.fetchTopAsks;
				break;
			case "show":
				content = getState().shows;
				actionType = actionTypes.INVALIDATE_SHOWS;
				refreshActionType = actionTypes.REFRESH_SHOWS;
				fetchAction = fetcher.fetchTopShows;
		}

		let lastRefresh =  content.lastRefresh;

		if(force || (now > lastRefresh+STORY_CACHE_EXPIRY_MIN*60*1000)){

			dispatch({
				type: actionType,
				lastRefresh: Date.now()
			});

			fetchAction().then(function(ids){

				loadContentAsync(ids.splice(0, MAIN_STORY_LIST_SIZE), dispatch, refreshActionType);

			});

		}
	}

}

function loadContentAsync(ids, dispatch, refreshActionType){

	if(ids.length>0){
		let idBatch =  ids.splice(0, STORY_LOAD_BATCH_SIZE);

		fetcher.fetchItems(idBatch).then(function(items){
			dispatch({
				type: refreshActionType,
				data: items,
				lastRefresh: Date.now()
			});

			loadContentAsync(ids, dispatch, refreshActionType);
		});
	}
}

export function viewItemDetail(id){
	return function(dispatch, getState){
		dispatch({
			type: actionTypes.VIEW_ITEM_DETAIL
		});

		fetcher.fetchItems([id]).then(function(items){
			let item = items[0];

			dispatch({
				type: actionTypes.REFRESH_ITEM_DETAIL,
				data: item
			});

			return item;
		}).then(function(item){
	
			dispatch(viewComments(item.kids));

		});
	}
}

export function viewComments(commentIds){
	return function(dispatch, getState) {

		const loadedIds = getState().comments.map(comment => (comment.id));
		const toLoadIds = commentIds.filter(cid => (loadedIds.indexOf(cid)<0));
		
		if(toLoadIds.length>0){
			// fetcher.fetchComments(toLoadIds).then(function(comments){
			// 	dispatch({
			// 		type: actionTypes.PUSH_COMMENTS,
			// 		comments: comments
			// 	});
			// })

			loadCommentsAsync(toLoadIds, dispatch);
		}
	}
}

function loadCommentsAsync(commentIds, dispatch){
	if(commentIds.length>0){
		let idBatch = commentIds.splice(0, COMMENT_LOAD_BATCH_SIZE);

		fetcher.fetchComments(idBatch).then(function(comments){
			dispatch({
				type: actionTypes.PUSH_COMMENTS,
				comments: comments
			});
			loadCommentsAsync(commentIds, dispatch);
		})
	}
}
