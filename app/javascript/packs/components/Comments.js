import React from 'react';
import {} from 'jquery';
import { render } from 'react-dom';

export default class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: this.props.comments,
      commentCount: this.props.commentCount,
      newComment: '',
      expandedComments: []
    }

    this._fetchComments = this._fetchComments.bind(this);
    this._handleUpVote = this._handleUpVote.bind(this);
    this._handleDownVote = this._handleDownVote.bind(this);
    this._handleExpandComment = this._handleExpandComment.bind(this);
    this._setCommentParentIds = this._setCommentParentIds.bind(this);
    this._handleSubmitComment = this._handleSubmitComment.bind(this);
    this._clearNewComment = this._clearNewComment.bind(this);
  }

  _fetchComments() {
    $.ajax({
      url: '/comments',
      type: 'GET',
      dataType: 'JSON',
      success: (data) => {
        this.setState({comments: data.comments, commentCount: data.comment_count});
      }
    });
  }

  _handleUpVote(event) {
    const id = parseInt(event.currentTarget.dataset.commentId);
    if (this.props.loggedIn) {

    } else {
      alert("Log in or sign up to join the Comment\u2011O craziness!");
    }
  }

  _handleDownVote(event) {
    const id = parseInt(event.currentTarget.dataset.commentId);
    if (this.props.loggedIn) {

    } else {
      alert("Log in or sign up to join the Comment\u2011O craziness!");
    }
  }

  _handleSubmitComment() {
    if (this.newComment.value === '') {
      alert('Your comment is blank! Gimme something to work with here.');
    } else {
      $.ajax({
        url: '/comments',
        type: 'POST',
        dataType: 'JSON',
        data: {
          comment: {
            content: this.newComment.value,
            oser_id: this.props.currentOser.id
          }
        },
        success: (data) => {
          alert('New comment created!');
          this._clearNewComment();
          this._fetchComments();
        },
        error: (xhr) => {
          let errors = $.parseJSON(xhr.responseText).errors;
          alert(errors);
        }
      });
    }
  }

  _clearNewComment() {
    $('#new-comment').val('');
  }

  _setCommentParentIds(commentId, parentIds) {
    this[`commentParentIds_${commentId}`] = parentIds;
  }

  _handleExpandComment(event) {
    const id = parseInt(event.currentTarget.dataset.commentId);
    let expandedComments = this.state.expandedComments;
    if (expandedComments.includes(id)) {
      let oserIndex = expandedComments.indexOf(id);
      expandedComments.splice(oserIndex, 1);
      this.setState({expandedComments});
    } else {
      expandedComments.push(id);
      $.ajax({
        url: `/comments/${id}/children`,
        type: 'GET',
        dataType: 'JSON',
        data: {
          parent_ids: this[`commentParentIds_${id}`]
        },
        success: (data) => {
          let parentIds = data.parent_ids;
          let comments = this.state.comments;
          let comment;
          let topParentId = parseInt(parentIds.shift());
          for (let i = 0; i < comments.length; i++) {
            comment = comments[i];
            if (parseInt(comment.id) === topParentId) {
              break;
            }
          }
          let nextParentId;
          for (let i = 0; i < parentIds.length; i++) {
            nextParentId = parseInt(parentIds[i]);
            for (let i = 0; i < comment.children.length; i++) {
              let child_comment = comment.children[i];
              if (parseInt(child_comment.id) === nextParentId) {
                comment = child_comment;
                break;
              }
            }
          }
          comment.children = data.children;
          data.children.forEach((child) => {
            if (expandedComments.includes(parseInt(child.id))) {
              let childIndex = expandedComments.indexOf(child.id);
              expandedComments.splice(childIndex, 1);
            }
          }, this);
          this.setState({comments, expandedComments});
        },
        error: (xhr) => {
          let errors = $.parseJSON(xhr.responseText).errors;
          alert(errors);
        }
      });
    }
  }

  render() {
    let comments = this.state.comments.map((comment) => {
      return(
        <Comment
          comment={comment}
          setParentIds={this._setCommentParentIds}
          onUpVote={this._handleUpVote}
          onDownVote={this._handleDownVote}
          onExpandComment={this._handleExpandComment}
          expandedComments={this.state.expandedComments}
          expanded={this.state.expandedComments.includes(comment.id)}
          key={comment.id}
        />
      );
    });
    return(
      <div className="container">
        <section className="hero is-info is-bold" style={{marginBottom: '1.5rem'}}>
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                Total comment count:
              </h1>
              <h2 className="subtitle">
                {this.state.commentCount}
              </h2>
            </div>
          </div>
        </section>
        {this.props.loggedIn && <div>
          <div className="field">
            <label className="label">New Comment</label>
            <div className="control">
              <textarea className="textarea" id="new-comment" placeholder="Comment on life!" rows="2" ref={newComment => this.newComment = newComment}></textarea>
            </div>
          </div>
          <div className="field is-grouped is-grouped-right">
            <p className="control">
              <a className="button is-info" onClick={this._handleSubmitComment}>
                Submit
              </a>
            </p>
            <p className="control">
              <a className="button is-light" onClick={this._clearNewComment}>
                Clear
              </a>
            </p>
          </div>
        </div>}
        {comments}
      </div>
    );
  }
}

export class Comment extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.setParentIds(this.props.comment.id, this.props.comment.parent_ids);
  }

  render() {
    let children = null;
    if (this.props.expanded) {
      children = this.props.comment.children.map((child) => {
        return(
          <Comment
            comment={child}
            setParentIds={this.props.setParentIds}
            onUpVote={this.props.onUpVote}
            onDownVote={this.props.onDownVote}
            onExpandComment={this.props.onExpandComment}
            expandedComments={this.props.expandedComments}
            expanded={this.props.expandedComments.includes(child.id)}
            key={child.id}
          />
        );
      });
    }
    return(
      <article className="media">
        <figure className="media-left">
        </figure>
        <div className="media-content">
          <div className="level" style={{marginBottom: '1rem'}}>
            <div className="level-left" style={{alignItems: 'left', justifyContent: 'left'}}>
              <div className="level-item" style={{alignItems: 'left', justifyContent: 'left'}}>
                <div className="content">
                  <strong>{this.props.comment.oser.username}</strong>
                  {this.props.comment.oser.flair !== null && <small className="subtitle has-text-info" style={{verticalAlign: 'super', fontSize: '0.75rem'}}>&nbsp;- {this.props.comment.oser.flair}</small>}
                  <br/>
                  {this.props.comment.content}
                  <br/>
                  <div className="content is-small" style={{display: 'inline-block', marginLeft: '1rem', marginBottom: 'unset'}}>
                    <time dateTime={this.props.comment.posted.datetime}>{this.props.comment.posted.formatted}</time>
                  </div>
                  <div className="content is-small" style={{display: 'inline-block', marginLeft: '1rem'}}>
                    {this.props.comment.edited && <time dateTime={this.props.comment.updated.datetime}>Edited: {this.props.comment.updated.formatted}</time>}
                  </div>
                </div>
              </div>
            </div>
            <div className="level-right" style={{marginTop: '0.75rem', alignItems: 'right', justifyContent: 'right'}}>
              <div className="level-item card-header-title" style={{alignItems: 'right', justifyContent: 'right'}}>
                <div className="field is-grouped is-grouped-multiline">
                  <div className="control">
                    <div className="tags has-addons">
                      <span className="tag">
                        <span className="icon">
                          <i className="fas fa-arrow-alt-circle-up"></i>
                        </span>
                      </span>
                      <span className="tag is-success">{this.props.comment.ups}</span>
                    </div>
                  </div>
                  <div className="control">
                    <div className="tags has-addons">
                      <span className="tag">
                        <span className="icon">
                          <i className="fas fa-arrow-alt-circle-down"></i>
                        </span>
                      </span>
                      <span className="tag is-warning">{this.props.comment.downs}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <nav className="level">
            <div className="level-left" style={{alignItems: 'left', justifyContent: 'left'}}>
              <div className="level-item" style={{alignItems: 'left', justifyContent: 'left'}}>
                <a className="has-text-info" title="Comment" style={{marginRight: '0.5rem'}}>
                  <span className="icon is-small"><i className="fas fa-reply"></i></span>
                </a>
                <a className="has-text-success" title="Up-vote" data-comment-id={this.props.comment.id} onClick={this.props.onUpVote} style={{marginRight: '0.5rem'}}>
                  <span className="icon is-small"><i className="fas fa-arrow-alt-circle-up"></i></span>
                </a>
                <a className="has-text-warning" title="Down-vote" data-comment-id={this.props.comment.id} onClick={this.props.onDownVote} style={{marginRight: '0.5rem'}}>
                  <span className="icon is-small"><i className="fas fa-arrow-alt-circle-down"></i></span>
                </a>
                {this.props.comment.children_count > 0 && <a className="has-text-info" data-comment-id={this.props.comment.id} onClick={this.props.onExpandComment} style={{marginRight: '0.5rem'}}>
                  {!this.props.expanded && <span className="icon" title={`${this.props.comment.children_count} nested comments`}><i className="fas fa-angle-down"></i></span>}
                  {this.props.expanded && <span className="icon" title={`${this.props.comment.children_count} nested comments`}><i className="fas fa-angle-up"></i></span>}
                </a>}
              </div>
            </div>
          </nav>
          {children}
        </div>
      </article>
    );
  }
}

$(document).ready(() => {
  const homeCommentsData = document.getElementById('home-comments-data');
  const commentsData = JSON.parse(homeCommentsData.getAttribute('data-comments'));
  const commentCountData = JSON.parse(homeCommentsData.getAttribute('data-comment-count'));
  const currentOserData = JSON.parse(homeCommentsData.getAttribute('data-current-oser'));
  const loggedInData = JSON.parse(homeCommentsData.getAttribute('data-logged-in'));
  let section = document.createElement('section');
  section.className = 'section';
  const footer = document.getElementById('footer');
  const container = document.body.insertBefore(section, footer);
  render(
    <Comments
      comments={commentsData}
      commentCount={commentCountData}
      currentOser={currentOserData}
      loggedIn={loggedInData}
    />,
    container
  );
});
