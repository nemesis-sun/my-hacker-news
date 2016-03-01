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
		invalidateStories: (force) => {dispatch(actions.invalidateContent("story", force))},
		invalidateAsks: (force) => {dispatch(actions.invalidateContent("ask", force))},
		invalidateShows: (force) => {dispatch(actions.invalidateContent("show", force))},
		invalidateLatest: (force) => {dispatch(actions.invalidateContent("latest", force))},
		viewItemDetail: (id) => {dispatch(actions.viewItemDetail(id))},
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
						<span>
							<i className="material-icons hn-link" style={{'fontSize':'13pt'}} onClick={this._onRefreshStories.bind(this)}>loop</i>
							<span>
								<IndexLink to='/'  style={{color: 'black', 'fontSize': '20pt'}}>My Hacker News</IndexLink>
							</span>
							&nbsp;&nbsp;
							<span className="hn-link hn-text-black">
								<Link to='/latest'>New</Link>
							</span>
							&nbsp;&nbsp;
							<span className="hn-link hn-text-black">
								<Link to='/asks'>Ask</Link>
							</span>
							&nbsp;&nbsp;
							<span className="hn-link hn-text-black">
								<Link to='/shows'>Show</Link>
							</span>							
						</span>
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

		if(path.indexOf("/i")===0)
			this.props.viewItemDetail(this.props.params.id);
		else if(path.indexOf("/asks")===0)
			this.props.invalidateAsks(true);
		else if(path.indexOf("/shows")===0)
			this.props.invalidateShows(true);
		else if(path.indexOf("/latest")===0)
			this.props.invalidateLatest(true);
		else if(path==="/")
			this.props.invalidateStories(true);
	}
}

class ItemListView extends React.Component {
	render() {

		let itemList = [];

		switch(this.props.location.pathname){
			case "/": itemList = this.props.stories.data; break;
			case "/asks": itemList = this.props.asks.data; break;
			case "/shows": itemList = this.props.shows.data; break;
			case "/latest": itemList = this.props.latest.data; break;
		}

		let itemEleList = itemList.map((item) => {
			return (<Item item={item} key={item.id} viewItemDetail={this.props.viewItemDetail} location={this.props.location}/>);
		});

		return (
			<div>{itemEleList}</div>
		);
	}

	componentDidMount() {
		this._invalidateContentIfNeeded(this.props.location.pathname);
	}

	componentWillReceiveProps(newProps){

		if(newProps.location.pathname!==this.props.location.pathname){
			this._invalidateContentIfNeeded(newProps.location.pathname);
		}
	}

	_invalidateContentIfNeeded(pathname){

		switch(pathname){
			case "/": this.props.invalidateStories(false); break;
			case "/asks": this.props.invalidateAsks(false); break;
			case "/shows": this.props.invalidateShows(false); break;
			case "/latest": this.props.invalidateLatest(false); break;
		}
	}


}

class Item extends React.Component {
	render() {
		let {item, location: {pathname}} = this.props;
		let itemText = <div></div>;
		let itemLink = null;

		if(pathname.indexOf("/i")===0)
			itemText = (<div dangerouslySetInnerHTML = {{__html: item.text}} className="hn-text-black"></div>);

		if(item.url)
			itemLink = (<a className='hn-story-card-title' href={item.url} target='_blank'>{item.title}</a>);
		else 
			itemLink = (<span className='hn-story-card-title hn-link hn-text-black'><Link to={'/i/'+item.id}>{item.title}</Link></span>);

		return (
			<div className='card blue-grey lighten-4'>
				<div className="card-content white-text">
					<div>
						{itemLink}
						<span className="hn-story-sec-text">&nbsp;&nbsp;&nbsp;{item.score}&nbsp;points</span>
						<span className='hn-story-sec-text hn-link'>&nbsp;by&nbsp;{item.by}</span>
						<span><Link to={'/i/'+item.id} className='hn-story-sec-text hn-link'>&nbsp;&nbsp;|&nbsp;{item.descendants+' comments'}</Link></span>
						{itemText}
					</div>
				</div>
			</div>
		);
	}
}

class ItemDetailView extends React.Component {
	render() {
		const {itemDetail, comments, viewComments} = this.props;
		
		if(itemDetail.invalidated)
			return (
				<div></div>
			);
		else
			return (
				<div>
					<Item item={itemDetail.item} viewItemDetail={this.props.viewItemDetail} location={this.props.location}></Item>
					<CommentList comments={comments} parent={itemDetail.item} key={itemDetail.item.id} viewComments={viewComments}/>
				</div>
			);
	}

	componentDidMount(){
		const {params: {id}, viewItemDetail} = this.props;
		viewItemDetail(id);
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
			<li className='collection-item blue-grey lighten-4 hn-comment-box'>			
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
	ItemListView: connectToStore(ItemListView),
	ItemDetailView: connectToStore(ItemDetailView)
}