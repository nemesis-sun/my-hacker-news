import * as fetcher from './dataFetcher'
import * as actionTypes from './actionTypes'


export function invalidateStories(dispatch, getState){
	dispatch({
		type: actionTypes.INVALIDATE_STORIES
	});

	fetcher.fetchTopStories().then(function(stories){
		dispatch({
			type: actionTypes.REFRESH_STORIES,
			data: stories
		})
	})
}

export function viewStoryDetail(sid){
	return function(dispatch, getState){
		dispatch({
			type: actionTypes.VIEW_STORY_DETAIL
		});

		fetcher.fetchStoryDetail(sid).then(function(story){
			dispatch({
				type: actionTypes.REFRESH_STORY_DETAIL,
				data: story
			});

			return story;
		}).then(function(story){
	
			dispatch(viewComments(story.kids));

			// fetcher.fetchComments(story.kids).then(function(comments){
			// 	dispatch({
			// 		type: actionTypes.PUSH_COMMENTS,
			// 		comments: comments 
			// 	});	
			// });
		});
	}
}

export function viewComments(commentIds){
	return function(dispatch, getState) {
		fetcher.fetchComments(commentIds).then(function(comments){
			dispatch({
				type: actionTypes.PUSH_COMMENTS,
				comments: comments
			});
		})
	}
}
