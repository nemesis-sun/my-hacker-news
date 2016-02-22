import React from 'react'
import {Router, Route, Link, hashHistory} from 'react-router'
import {connect} from 'react-redux'
import * as fetcher from './dataFetcher'
import * as actionTypes from './actionTypes'

function mapStateToProps(state){
	return state;
}

function mapDispatchToProps(dispatch){
	return {
		invalidateStories: () => {dispatch({type: actionTypes.INVALIDATE_STORIES})},
		refreshStories: (stories) => {dispatch({type: actionTypes.REFRESH_STORIES, data: stories})}
	}
}

const connectToStore = connect(mapStateToProps, mapDispatchToProps);


class HackerNews extends React.Component {
	render() {
		return (
			<div>
				<h2>My Hacker News</h2>
				<ul>
		        	<li><Link to="/list">All Stories</Link></li>
		        	<li><Link to="/s/555">Story Detail</Link></li>
		        </ul>
		        {this.props.children}
			</div>
		);
	}

	componentDidMount(){
		let self = this;
		fetcher.fetchTopStories().then(function(data){
			self.props.refreshStories(data);
		});
	}
}

class StoryListView extends React.Component {
	render() {
		let storyList = this.props.stories.data.map((story) => {
			return (<StoryItem story={story} key={story.id}/>);
		});

		return (
			<div>{storyList}</div>
		);
	}
}

class StoryItem extends React.Component {
	render() {
		let story = this.props.story;

		return (
			<div>
				<a href={story.url}>{story.title}</a>
				<span><Link to={'/s/'+story.id}>{story.descendants+'comments'}</Link></span>
			</div>
		);
	}
}

class StoryDetailView extends React.Component {
	render() {
		return (<h3>StoryDetailView</h3>);
	}
}


export default {
	HackerNews: connectToStore(HackerNews),
	StoryListView: connectToStore(StoryListView),
	StoryDetailView: connectToStore(StoryDetailView)
}