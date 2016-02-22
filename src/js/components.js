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
		refreshStories: (stories) => {dispatch({type: actionTypes.REFRESH_STORIES, data: stories})},
		viewStoryDetail: () => {dispatch({type: actionTypes.VIEW_STORY_DETAIL})},
		refreshStoryDetail: (story) => {dispatch({type: actionTypes.REFRESH_STORY_DETAIL, data: story})}
	}
}

const connectToStore = connect(mapStateToProps, mapDispatchToProps);


class HackerNews extends React.Component {
	render() {
		return (
			<div>
				<div className='row'>
					<div className='col s12'>
						<h4>My Hacker News</h4>				
					</div>		        
				</div>
				<div className='row'>
					<div className='col s12'>
						{this.props.children}
					</div>		        
				</div>
			</div>
		);
	}

	componentDidMount() {
		let self = this;
		fetcher.fetchTopStories().then(function(data){
			self.props.refreshStories(data);
		});
	}
}

class StoryListView extends React.Component {
	render() {
		let storyList = this.props.stories.data.map((story) => {
			return (<StoryItem story={story} key={story.id} viewStoryDetail={this.props.viewStoryDetail} />);
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
			<div className='card orange lighten-2'>
				<div className="card-content white-text">
					<div>
						<a className='hn-story-card-title' href={story.url}>{story.title}</a>
						<span className='hn-story-sec-text'>&nbsp;&nbsp;&nbsp;by&nbsp;{story.by}</span>
					</div>
					<div>
						<span><Link to={'/s/'+story.id} className='hn-story-sec-text' onClick={this._onStoryDetailClick.bind(this, story.id)}>{story.descendants+' comments'}</Link></span>
					</div>					
				</div>
			</div>
		);
	}

	_onStoryDetailClick(sid, e){
		let self = this;
		self.props.viewStoryDetail();
	}
}

class StoryDetailView extends React.Component {
	render() {
		const {storyDetail} = this.props;

		return (
			<div>StoryDetailView</div>
		);
	}

	componentDidMount(){
	}
}


export default {
	HackerNews: connectToStore(HackerNews),
	StoryListView: connectToStore(StoryListView),
	StoryDetailView: connectToStore(StoryDetailView)
}