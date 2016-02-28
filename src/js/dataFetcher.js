import Q from 'q'

const TOP_STORIES_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";
const STORIES_DETAIL_URL = "https://hacker-news.firebaseio.com/v0/item/:id.json";

const noCacheHeader = {
	"Cache-Control" : "no-cache"
};

export function fetchTopStories(){
	return fetch(TOP_STORIES_URL, {headers: noCacheHeader}).then(function(res){
		return res.json();
	});

	// .then(function(storyIds){
	// 	let topIds = storyIds.slice(0, 20);

	// 	let storyFetchPromises = [];
	// 	for(let id of topIds){
	// 		storyFetchPromises.push(fetch(STORIES_DETAIL_URL.replace(":id", id)));
	// 	}

	// 	return Q.all(storyFetchPromises);
	// }).then(function(resps){

	// 	let jsonPromises = [];
	// 	for(let res of resps){
	// 		jsonPromises.push(res.json());
	// 	}

	// 	return Q.all(jsonPromises);
		
	// }).then(function(jsons){

	// 	return jsons;
	// });
}

export function fetchStories(storyIds){
	let fetchRequests = [];
	for(let sid of storyIds)
		fetchRequests.push(fetch(STORIES_DETAIL_URL.replace(":id", sid), {headers: noCacheHeader}));

	return Q.all(fetchRequests).then(function(resps){
		let jsonPromises = [];
		for(let res of resps){
			jsonPromises.push(res.json());
		}

		return Q.all(jsonPromises);
	});
}

export function fetchStoryDetail(id){
	return fetch(STORIES_DETAIL_URL.replace(":id", id), {headers: noCacheHeader}).then(function(res){
		return res.json();
	});
}

export function fetchComments(commentIds){
	let fetchRequests = [];
	for(let cid of commentIds){
		fetchRequests.push(fetch(STORIES_DETAIL_URL.replace(":id", cid), {headers: noCacheHeader}));
	}

	return Q.all(fetchRequests).then(function(resps){

		let jsonPromises = [];
		for(let res of resps){
			jsonPromises.push(res.json());
		}

		return Q.all(jsonPromises);
	}).then(function(jsons){
		jsons = jsons.filter(json => !json.deleted);
		return jsons;
	});
}