import React from 'react'
import {Router, Route, Link, IndexLink, hashHistory} from 'react-router'
import {connect} from 'react-redux'
import * as actionTypes from './actionTypes'
import * as actions from './actions'

function mapStateToProps(state){
	return state;
}

function mapDispatchToProps(dispatch){
	return {
		invalidateStories: (force) => {dispatch(actions.invalidateStories(force))},
		viewStoryDetail: (sid) => {dispatch(actions.viewStoryDetail(sid))},
		viewComments: (commentIds) => {dispatch(actions.viewComments(commentIds))}
	}
}

const connectToStore = connect(mapStateToProps, mapDispatchToProps);


class HackerNews extends React.Component {
	render() {
		return (
			<div>
				<div className='row'>
					<div className='col s12'>
						<h4>
							<i className="material-icons hn-link" style={{'fontSize':'13pt'}} onClick={this._onRefreshStories.bind(this)}>loop</i>
							<IndexLink to='/'  style={{color: 'black'}}>My Hacker News</IndexLink>
						</h4>

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

	_onRefreshStories(){
		const {location: {pathname: path}} = this.props;
		if(path.indexOf("/s")===0)
			this.props.viewStoryDetail(this.props.params.sid);
		else
			this.props.invalidateStories(true);
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

	componentDidMount() {
		this.props.invalidateStories(false);		
	}
}

class StoryItem extends React.Component {
	render() {
		let story = this.props.story;

		return (
			<div className='card orange lighten-4'>
				<div className="card-content white-text">
					<div>
						<a className='hn-story-card-title' href={story.url} target='_blank'>{story.title}</a>
						<span className="hn-story-sec-text">&nbsp;&nbsp;&nbsp;{story.score}&nbsp;points</span>
						<span className='hn-story-sec-text hn-link'>&nbsp;by&nbsp;{story.by}</span>
						<span><Link to={'/s/'+story.id} className='hn-story-sec-text hn-link'>&nbsp;&nbsp;|&nbsp;{story.descendants+' comments'}</Link></span>
					</div>
				</div>
			</div>
		);
	}
}

class StoryDetailView extends React.Component {
	render() {
		const {storyDetail, comments, viewComments} = this.props;
		
		if(storyDetail.invalidated)
			return (
				<div></div>
			);
		else
			return (
				<div>
					<StoryItem story={storyDetail.story}></StoryItem>
					<CommentList comments={comments} parent={storyDetail.story} key={storyDetail.story.id} viewComments={viewComments}/>
				</div>
			);
	}

	componentDidMount(){
		const {sid} = this.props.params;
		this.props.viewStoryDetail(sid);
	}
}

class CommentList extends React.Component {
	render() {


		const {comments, parent, viewComments} = this.props;

		//console.log("CommentList:beforeFilter "+comments.length);

		let storyComments = [];

		if(parent.kids && parent.kids.length>0){
			comments.forEach((comment) => {
				let i = parent.kids.indexOf(comment.id);
				if(i>=0)
					storyComments[i] = comment;
			});
		}

		//console.log("CommentList:afterFilter "+storyComments.length);

		if(storyComments.length===0)
			return null;


		let commentEles = storyComments.map((comment) => {
			return (<CommentItem comment={comment} key={comment.id} allComments={comments} viewComments={viewComments} />);
		});

		return (
			<ul className='collection'>{commentEles}</ul>
		);
	}
}

class CommentItem extends React.Component {
	render() {
		const {comment, allComments, viewComments} = this.props;
		const noOfReplies = comment.kids?comment.kids.length:0;
		return (
			<li className='collection-item red lighten-5 hn-comment-box'>			
					<div>
						<span className='hn-story-sec-text'>{comment.by}&nbsp;&nbsp;&nbsp;</span>
						<span className='hn-story-sec-text hn-link' disabled={noOfReplies===0} onClick={this._viewChildComments.bind(this)}>{noOfReplies}&nbsp;replies</span>
					</div>
					<div dangerouslySetInnerHTML={{__html: comment.text}}></div>
					<div>
						<CommentList comments={allComments} parent={comment} key={comment.id} viewComments={viewComments} />
					</div>
			</li>
		);
	}

	_viewChildComments(){
		const {comment, viewComments} = this.props;
		if(comment.kids && comment.kids.length > 0) {
			viewComments(comment.kids);
		}
	}
}


export default {
	HackerNews: connectToStore(HackerNews),
	StoryListView: connectToStore(StoryListView),
	StoryDetailView: connectToStore(StoryDetailView)
}