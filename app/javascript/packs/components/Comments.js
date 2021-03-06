import React from 'react';
import {} from 'jquery';
import { render } from 'react-dom';

export class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOser: this.props.currentOser,
      comments: this.props.comments,
      commentCount: this.props.commentCount,
      newComment: '',
      expandedComments: [],
      currentReplyTarget: null,
      currentReply: '',
      currentEditTarget: null,
      currentEdit: '',
      fieldFilters: []
    }

    this._fetchComments = this._fetchComments.bind(this);
    this._handleReply = this._handleReply.bind(this);
    this._handleReplyChange = this._handleReplyChange.bind(this);
    this._handleUpVote = this._handleUpVote.bind(this);
    this._handleDownVote = this._handleDownVote.bind(this);
    this._handleExpandComment = this._handleExpandComment.bind(this);
    this._handleSubmitComment = this._handleSubmitComment.bind(this);
    this._handleSubmitReply = this._handleSubmitReply.bind(this);
    this._clearNewComment = this._clearNewComment.bind(this);
    this._handleEditComment = this._handleEditComment.bind(this);
    this._handleUpdateComment = this._handleUpdateComment.bind(this);
    this._handleEditChange = this._handleEditChange.bind(this);
    this._handleSearch = this._handleSearch.bind(this);
    this._handleFieldFilter = this._handleFieldFilter.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  _fetchComments(replyTargetId = null) {
    let childrenPopulated = this.state.expandedComments;
    if (replyTargetId !== null) {
      childrenPopulated.push(replyTargetId);
    }
    if (this.props.module) {
      this.props.onRefresh(this.state.currentOser, childrenPopulated.join());
    } else {
      $.ajax({
        url: '/comments',
        type: 'GET',
        dataType: 'JSON',
        data: {
          top_level: true,
          children_populated: childrenPopulated.join()
        },
        success: (data) => {
          this.setState({
            comments: data.comments,
            commentCount: data.comment_count,
            expandedComments: childrenPopulated
          });
        }
      });
    }
  }

  _handleUpVote(event) {
    if (this.props.loggedIn) {
      const voted = event.currentTarget.dataset.voted === 'true';
      const commentId = parseInt(event.currentTarget.dataset.commentId);
      const oserId = this.state.currentOser.id;
      $.ajax({
        url: '/upvotes',
        type: voted ? 'DELETE' : 'POST',
        dataType: 'JSON',
        data: {
          upvote: {
            oser_id: oserId,
            comment_id: commentId
          }
        },
        success: (data) => {
          this.setState({currentOser: data.oser});
          this._fetchComments();
        },
        error: (xhr) => {
          let errors = $.parseJSON(xhr.responseText).errors;
          alert(errors);
        }
      });
    } else {
      alert("Log in or sign up to join the Comment\u2011O craziness!");
    }
  }

  _handleDownVote(event) {
    if (this.props.loggedIn) {
      const voted = event.currentTarget.dataset.voted === 'true';
      const commentId = parseInt(event.currentTarget.dataset.commentId);
      const oserId = this.state.currentOser.id;
      $.ajax({
        url: '/downvotes',
        type: voted ? 'DELETE' : 'POST',
        dataType: 'JSON',
        data: {
          downvote: {
            oser_id: oserId,
            comment_id: commentId
          }
        },
        success: (data) => {
          this.setState({currentOser: data.oser});
          this._fetchComments();
        },
        error: (xhr) => {
          let errors = $.parseJSON(xhr.responseText).errors;
          alert(errors);
        }
      });
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
            oser_id: this.state.currentOser.id
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

  _handleUpdateComment(event) {
    const id = parseInt(event.currentTarget.dataset.commentId);
    const initialComment = event.currentTarget.dataset.initialComment;
    if (this.state.currentEdit === '') {
      alert('Your comment is blank! Gimme something to work with here.');
    } else if(this.state.currentEdit === initialComment) {
      alert('No change detected.');
    } else {
      $.ajax({
        url: `/comments/${id}`,
        type: 'PATCH',
        dataType: 'JSON',
        data: {
          comment: {
            content: this.state.currentEdit
          }
        },
        success: (data) => {
          alert('Comment updated!');
          this._fetchComments();
        },
        error: (xhr) => {
          let errors = $.parseJSON(xhr.responseText).errors;
          alert(errors);
        }
      });
    }
    this.setState({currentEditTarget: null, currentEdit: ''})
  }

  _handleEditComment(event) {
    const id = parseInt(event.currentTarget.dataset.commentId);
    let currentEditTarget;
    let currentEdit = this.state.currentEdit;
    if (this.state.currentEditTarget === id) {
      currentEditTarget = null;
      currentEdit = '';
    } else {
      currentEditTarget = id;
    }
    this.setState({currentEditTarget, currentEdit});
  }

  _handleEditChange(event) {
    this.setState({currentEdit: event.currentTarget.value});
  }

  _clearNewComment() {
    $('#new-comment').val('');
  }

  _handleReply(event) {
    const id = parseInt(event.currentTarget.dataset.commentId);
    const ancestorCount = parseInt(event.currentTarget.dataset.ancestorCount);
    let currentReplyTarget;
    if (!this.props.loggedIn) {
      alert("Log in or sign up to join the Comment\u2011O craziness!");
    } else if (ancestorCount >= 5) {
      alert("We do not currently support nested comments deeper than 5 :/");
    } else {
      if (this.state.currentReplyTarget === id) {
        currentReplyTarget = null;
      } else {
        currentReplyTarget = id;
      }
      this.setState({currentReplyTarget});
    }
  }

  _handleReplyChange(event) {
    this.setState({currentReply: event.currentTarget.value});
  }

  _handleSubmitReply(event) {
    const id = parseInt(event.currentTarget.dataset.commentId);
    if (this.state.currentReply === '') {
      alert('Your comment is blank! Gimme something to work with here.');
    } else {
      $.ajax({
        url: '/comments',
        type: 'POST',
        dataType: 'JSON',
        data: {
          comment: {
            content: this.state.currentReply,
            oser_id: this.state.currentOser.id,
            parent_id: id
          }
        },
        success: (data) => {
          alert('Comment created!');
          this.setState({currentReply: '', currentReplyTarget: null});
          this._fetchComments(id);
        },
        error: (xhr) => {
          let errors = $.parseJSON(xhr.responseText).errors;
          alert(errors);
        }
      });
    }
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
        success: (data) => {
          let ancestorIds = data.ancestor_ids;
          let comments = this.state.comments;
          let comment;
          let topParentId = parseInt(ancestorIds.shift());
          for (let i = 0; i < comments.length; i++) {
            comment = comments[i];
            if (parseInt(comment.id) === topParentId) {
              break;
            }
          }
          let nextParentId;
          for (let i = 0; i < ancestorIds.length; i++) {
            nextParentId = parseInt(ancestorIds[i]);
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

  _handleSearch(fieldFilters) {
    let fields = this.state.fieldFilters.join(',');
    if (Array.isArray(fieldFilters)) {
      fields = fieldFilters.join(',');
    }
    let query = this.searchQuery.value;
    $.ajax({
      url: '/comments/search',
      type: 'GET',
      dataType: 'JSON',
      data: {
        query: query,
        fields: fields
      },
      success: (data) => {
        this.setState({comments: data.comments, expandedComments: []});
      },
      error: (xhr) => {
        let errors = $.parseJSON(xhr.responseText).errors;
        alert(errors);
      }
    });
  }

  _handleFieldFilter(event) {
    let field = event.currentTarget.dataset.field;
    let fieldFilters = this.state.fieldFilters;
    if (field === 'reset') {
      fieldFilters = [];
      this.setState({fieldFilters});
    } else if (fieldFilters.includes(field)) {
      fieldFilters.splice(fieldFilters.indexOf(field), 1);
      this.setState({fieldFilters});
    } else {
      fieldFilters.push(field);
      this.setState({fieldFilters});
    }
    if (this.searchQuery.value.length > 0) {
      this._handleSearch(fieldFilters);
    }
  }

  render() {
    let comments = this.state.comments.map((comment) => {
      return(
        <Comment
          comment={comment}
          onReply={this._handleReply}
          onReplyChange={this._handleReplyChange}
          currentReplyTarget={this.state.currentReplyTarget}
          onSubmitReply={this._handleSubmitReply}
          onUpVote={this._handleUpVote}
          onDownVote={this._handleDownVote}
          onEditComment={this._handleEditComment}
          onEditChange={this._handleEditChange}
          onUpdateComment={this._handleUpdateComment}
          currentEditTarget={this.state.currentEditTarget}
          onExpandComment={this._handleExpandComment}
          expandedComments={this.state.expandedComments}
          expanded={this.state.expandedComments.includes(comment.id)}
          currentOser={this.state.currentOser}
          loggedIn={this.props.loggedIn}
          key={comment.id}
        />
      );
    });
    return(
      <div className={this.props.module ? "" : "container"}>
        {!this.props.module && <section className="hero is-info is-bold" style={{marginBottom: '1.5rem'}}>
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
        </section>}
        {this.props.loggedIn && this.props.showNewComment && <div style={{marginBottom: '1rem'}}>
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
        {!this.props.module && <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <form action="javascript:void(0);">
                <div className="field has-addons">
                  <p className="control">
                    <input className="input" type="text" placeholder="Search comments" ref={searchQuery => this.searchQuery = searchQuery}/>
                  </p>
                  <p className="control">
                    <button type="submit" className="button is-info" onClick={this._handleSearch}>
                      Search
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
          <div className="level-item">
            <div className="box" style={{marginTop: '0.5rem'}}>
              <div className="buttons">
                <label className="label" style={{marginRight: '1rem'}}>Search fields:</label>
                <span className={this.state.fieldFilters.includes('osername') ? 'button is-small is-active' : 'button is-small'} onClick={this._handleFieldFilter} data-field="osername">Oser</span>
                <span className={this.state.fieldFilters.includes('content') ? 'button is-small is-active' : 'button is-small'} onClick={this._handleFieldFilter} data-field="content">Comment</span>
                <span className="button is-small is-danger is-outlined" onClick={this._handleFieldFilter} data-field="reset">Reset</span>
              </div>
            </div>
          </div>
        </nav>}
        {comments}
      </div>
    );
  }
}

export class Comment extends React.Component {
  constructor() {
    super();
  }

  render() {
    let children = null;
    if (this.props.expanded) {
      children = this.props.comment.children.map((child) => {
        return(
          <Comment
            comment={child}
            small={true}
            onReply={this.props.onReply}
            onReplyChange={this.props.onReplyChange}
            currentReplyTarget={this.props.currentReplyTarget}
            onSubmitReply={this.props.onSubmitReply}
            onUpVote={this.props.onUpVote}
            onDownVote={this.props.onDownVote}
            onEditComment={this.props.onEditComment}
            onEditChange={this.props.onEditChange}
            onUpdateComment={this.props.onUpdateComment}
            currentEditTarget={this.props.currentEditTarget}
            onExpandComment={this.props.onExpandComment}
            expandedComments={this.props.expandedComments}
            expanded={this.props.expandedComments.includes(child.id)}
            currentOser={this.props.currentOser}
            loggedIn={this.props.loggedIn}
            key={child.id}
          />
        );
      });
    }
    let dots = [];
    if (this.props.comment.ancestor_ids.length > 0) {
      for (let i = 0; i < this.props.comment.ancestor_ids.length; i++) {
        dots.push(
          <span className="icon" key={i} style={{marginRight: '-1rem'}}>
            <i className="fas fa-angle-right"></i>
          </span>
        );
      }
    }
    let commentUpvoted = this.props.loggedIn && this.props.currentOser.upvoted_comment_ids.includes(this.props.comment.id);
    let commentDownvoted = this.props.loggedIn && this.props.currentOser.downvoted_comment_ids.includes(this.props.comment.id);
    return(
      <article className="media">
        <figure className="media-left">
          {dots}
        </figure>
        <div className="media-content">
          <nav className="level" style={{marginBottom: 'unset'}}>
            <div className="level-left">
              <div className="level-item" style={{alignItems: 'flex-start', justifyContent: 'flex-start'}} onClick={() => window.open(`/osers/${this.props.comment.oser.id}`)}>
                <a className="content" style={{width: '100%', color: 'unset'}}>
                  <strong>{this.props.comment.oser.username}</strong>
                  {this.props.comment.oser.flair !== null &&
                    <small className={this.props.comment.oser.flair_color !== null ? 'subtitle is-6' : 'subtitle is-6 has-text-info'} style={{color: this.props.comment.oser.flair_color, verticalAlign: 'super', fontSize: '0.75rem'}}>
                      &nbsp;- {this.props.comment.oser.flair}
                    </small>
                  }
                </a>
              </div>
            </div>
            <div className="level-right" style={{alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: 'unset'}}>
              <div className="level-item card-header-title" style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                <div className="field is-grouped is-grouped-multiline">
                  <div className="control">
                    <div className="tags has-addons">
                      <span className="tag">
                        <span className="icon">
                          <i className="fas fa-arrow-alt-circle-up"></i>
                        </span>
                      </span>
                      <span className="tag is-success">{this.props.comment.upvotes}</span>
                    </div>
                  </div>
                  <div className="control">
                    <div className="tags has-addons">
                      <span className="tag">
                        <span className="icon">
                          <i className="fas fa-arrow-alt-circle-down"></i>
                        </span>
                      </span>
                      <span className="tag is-warning">{this.props.comment.downvotes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <div className="content" style={{width: '100%'}}>
            {this.props.currentEditTarget !== this.props.comment.id &&
              <div className="field" style={{marginBottom: 'unset'}}>
                <div className="control">
                  <div>
                    {this.props.comment.content}
                  </div>
                </div>
              </div>
            }
            {this.props.currentEditTarget === this.props.comment.id &&
              <div className="field" style={{marginBottom: 'unset'}}>
                <p className="control">
                  <textarea className="textarea" defaultValue={this.props.comment.content} rows="2" onChange={this.props.onEditChange}></textarea>
                </p>
                <div className="field is-grouped is-grouped-right">
                  <p className="control">
                    <a className="button is-info" data-comment-id={this.props.comment.id} data-initial-comment={this.props.comment.content} onClick={this.props.onUpdateComment}>
                      Update
                    </a>
                  </p>
                  <p className="control">
                    <a className="button is-light" data-comment-id={this.props.comment.id} onClick={this.props.onEditComment}>
                      Cancel
                    </a>
                  </p>
                </div>
              </div>
            }
            <div className="content is-small" style={{display: 'inline-block', marginLeft: '1rem', marginBottom: 'unset'}}>
              <time dateTime={this.props.comment.posted.datetime}>{this.props.comment.posted.formatted}</time>
            </div>
            <div className="content is-small" style={{display: 'inline-block', marginLeft: '1rem'}}>
              {this.props.comment.edited && <time dateTime={this.props.comment.updated.datetime}>Edited: {this.props.comment.updated.formatted}</time>}
            </div>
          </div>
          <nav className="level">
            <div className="level-left" style={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
              <div className="level-item" style={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                <a className={this.props.comment.ancestor_ids.length >= 5 ? 'has-text-light' : 'has-text-info'} title="Comment" data-ancestor-count={this.props.comment.ancestor_ids.length} data-comment-id={this.props.comment.id} onClick={this.props.onReply} style={{marginRight: '0.5rem'}}>
                  <span className="icon is-small"><i className="fas fa-reply"></i></span>
                </a>
                {this.props.loggedIn && this.props.currentOser.id === this.props.comment.oser.id && <a className="has-text-info" title="Edit" data-comment-id={this.props.comment.id} onClick={this.props.onEditComment} style={{marginRight: '0.5rem'}}>
                  <span className="icon is-small"><i className="fas fa-edit"></i></span>
                </a>}
                <a className={commentUpvoted ? "has-text-success" : "has-text-light"} title="Upvote" data-voted={commentUpvoted} data-comment-id={this.props.comment.id} onClick={this.props.onUpVote} style={{marginRight: '0.5rem'}}>
                  <span className="icon is-small"><i className="fas fa-arrow-alt-circle-up"></i></span>
                </a>
                <a className={commentDownvoted ? "has-text-warning" : "has-text-light"} title="Downvote" data-voted={commentDownvoted} data-comment-id={this.props.comment.id} onClick={this.props.onDownVote} style={{marginRight: '0.5rem'}}>
                  <span className="icon is-small"><i className="fas fa-arrow-alt-circle-down"></i></span>
                </a>
                {this.props.comment.children_count > 0 && <a className="has-text-info" data-comment-id={this.props.comment.id} onClick={this.props.onExpandComment} style={{marginRight: '0.5rem'}}>
                  {!this.props.expanded && <span className="icon" title={`${this.props.comment.children_count} nested comments`}><i className="fas fa-angle-down"></i></span>}
                  {this.props.expanded && <span className="icon" title={`${this.props.comment.children_count} nested comments`}><i className="fas fa-angle-up"></i></span>}
                </a>}
              </div>
            </div>
          </nav>
          {this.props.currentReplyTarget === this.props.comment.id &&
            <CommentReply
              parentId={this.props.comment.id}
              onChange={this.props.onReplyChange}
              onCancelReply={this.props.onReply}
              onSubmitReply={this.props.onSubmitReply}
            />
          }
          {children}
        </div>
      </article>
    );
  }
}

export class CommentReply extends React.Component {
  constructor() {
    super();
  }

  render() {
    return(
      <article className="media">
        <figure className="media-left">
        </figure>
        <div className="media-content">
          <div className="field">
            <p className="control">
              <textarea className="textarea is-small" placeholder="Add a comment..." rows="2" onChange={this.props.onChange}></textarea>
            </p>
          </div>
          <div className="field is-grouped is-grouped-multiline" style={{marginBottom: 'auto', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
            <p className="control" style={{marginRight: 'unset'}}>
              <a className="button is-info is-small" data-comment-id={this.props.parentId} onClick={this.props.onSubmitReply}>
                Submit
              </a>
            </p>
            <p className="control" style={{marginLeft: '0.75rem'}}>
              <a className="button is-light is-small" onClick={this.props.onCancelReply}>
                Cancel
              </a>
            </p>
          </div>
        </div>
      </article>
    );
  }
}

$(document).ready(() => {
  const homeCommentsData = document.getElementById('home-comments-data');
  if (homeCommentsData !== null) {
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
        module={false}
        showNewComment={true}
      />,
      container
    );
  }
});
