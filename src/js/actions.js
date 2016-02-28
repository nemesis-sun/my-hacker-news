import * as fetcher from './dataFetcher'
import * as actionTypes from './actionTypes'


const COMMENT_LOAD_BATCH_SIZE = 5;


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
