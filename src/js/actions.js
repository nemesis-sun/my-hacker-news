import * as fetcher from './dataFetcher'
import * as actionTypes from './actionTypes'


const COMMENT_LOAD_BATCH_SIZE = 5;
const MAIN_STORY_LIST_SIZE = 50;
const STORY_LOAD_BATCH_SIZE = 10;

const STORY_CACHE_EXPIRY_MIN = 1;

export function invalidateStories(force){

	return function(dispatch, getState){

		let now = Date.now();
		let storyLastRefresh =  getState().stories.lastRefresh;

		if(force || (now > storyLastRefresh+STORY_CACHE_EXPIRY_MIN*60*1000)){

			dispatch({
				type: actionTypes.INVALIDATE_STORIES,
				lastRefresh: Date.now()
			});

			fetcher.fetchTopStories().then(function(storyIds){

				loadStoriesAsync(storyIds.splice(0, MAIN_STORY_LIST_SIZE), dispatch);

			});

		}
	}

}

function loadStoriesAsync(storyIds, dispatch){

	if(storyIds.length>0){
		let idBatch =  storyIds.splice(0, STORY_LOAD_BATCH_SIZE);

		fetcher.fetchStories(idBatch).then(function(stories){
			dispatch({
				type: actionTypes.REFRESH_STORIES,
				data: stories,
				lastRefresh: Date.now()
			});

			loadStoriesAsync(storyIds, dispatch);
		});
	}
}

export function viewStoryDetail(sid){
	return function(dispatch, getState){
		dispatch({
			type: actionTypes.VIEW_STORY_DETAIL
		});

		fetcher.fetchStories([sid]).then(function(stories){
			let story = stories[0];

			dispatch({
				type: actionTypes.REFRESH_STORY_DETAIL,
				data: story
			});

			return story;
		}).then(function(story){
	
			dispatch(viewComments(story.kids));

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
