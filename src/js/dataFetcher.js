import Q from 'q'

const TOP_STORIES_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";
const STORIES_DETAIL_URL = "https://hacker-news.firebaseio.com/v0/item/:id.json";

export function fetchTopStories(){
	return fetch(TOP_STORIES_URL).then(function(res){
		return res.json();
	}).then(function(storyIds){
		let firstTenIds = storyIds.slice(0, 10);
		console.log(firstTenIds);

		let storyFetchPromises = [];
		for(let id of firstTenIds){
			storyFetchPromises.push(fetch(STORIES_DETAIL_URL.replace(":id", id)));
		}

		return Q.all(storyFetchPromises);
	}).then(function(resps){

		console.log("Got 10 responses");
		console.log(resps);

		let jsonPromises = [];
		for(let res of resps){
			jsonPromises.push(res.json());
		}

		return Q.all(jsonPromises);
		
	}).then(function(jsons){
		console.log("Got 10 jsons");
		console.log(jsons);

		return jsons;
	});
}