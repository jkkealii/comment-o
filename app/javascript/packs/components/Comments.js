import React from 'react';
import {} from 'jquery';
import { render } from 'react-dom';

export default class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: this.props.comments,
      expandedComments: []
    }

    this._handleUpVote = this._handleUpVote.bind(this);
    this._handleDownVote = this._handleDownVote.bind(this);
    this._handleExpandComment = this._handleExpandComment.bind(this);
  }

  _handleUpVote(event) {
    const id = parseInt(event.currentTarget.dataset.commentId);
  }

  _handleDownVote(event) {
    const id = parseInt(event.currentTarget.dataset.commentId);
  }

  _handleExpandComment(event) {
    const id = parseInt(event.currentTarget.dataset.commentId);
    let expandedComments = this.state.expandedComments;
    if (expandedComments.includes(id)) {
      let oserIndex = expandedComments.indexOf(id);
      expandedComments.splice(oserIndex, 1);
    } else {
      expandedComments.push(id);
      $.ajax({
        url: `/comments/${id}/children`,
        type: 'GET',
        dataType: 'JSON',
        success: (data) => {
          let comments = this.state.comments;
          let comment;
          for (let i = 0; i < comments.length; i++) {
            comment = comments[i];
            if (parseInt(comment.id) === id) {
              break;
            }
          }
          comment.children = data.children;
          this.setState({comments});
        },
        error: (xhr) => {
          let errors = $.parseJSON(xhr.responseText).errors;
          alert(errors);
        }
      });
    }
    this.setState({expandedComments});
  }

  render() {
    let comments = this.state.comments.map((comment) => {
      return(
        <Comment
          comment={comment}
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
        <div className="field">
          <label className="label">New Comment</label>
          <div className="control">
            <textarea className="textarea" placeholder="Comment on life!" rows="2" ref={newComment => this.newComment = newComment}></textarea>
          </div>
        </div>
        <div className="field is-grouped is-grouped-right">
          <p className="control">
            <a className="button is-info">
              Submit
            </a>
          </p>
          <p className="control">
            <a className="button is-light">
              Clear
            </a>
          </p>
        </div>
        {comments}
      </div>
    );
  }
}

export class Comment extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let children = null;
    if (this.props.expanded) {
      children = this.props.comment.children.map((child) => {
        return(
          <Comment
            comment={child}
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
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <div className="content">
                  <strong>{this.props.comment.oser.username}</strong>
                  {this.props.comment.oser.flair !== null && <small className="subtitle has-text-info" style={{verticalAlign: 'super', fontSize: '0.75rem'}}>&nbsp;- {this.props.comment.oser.flair}</small>}
                  <br/>
                  {this.props.comment.content}
                  <br/>
                  <nav className="level">
                    <div className="level-left">
                      <div className="level-item content is-small" style={{justifyContent: 'unset'}}>
                        <time dateTime={this.props.comment.posted.datetime}>{this.props.comment.posted.formatted}</time>
                      </div>
                    </div>
                    <div className="level-right">
                      <div className="level-item content is-small" style={{justifyContent: 'unset'}}>
                        {this.props.comment.edited && <time dateTime={this.props.comment.updated.datetime}>Edited: {this.props.comment.updated.formatted}</time>}
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item card-header-title">
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
          <nav className="level is-mobile">
            <div className="level-left">
              <a className="level-item has-text-info">
                <span className="icon is-small"><i className="fas fa-reply"></i></span>
              </a>
              <a className="level-item has-text-success" data-comment-id={this.props.comment.id} onClick={this.props.onUpVote}>
                <span className="icon is-small"><i className="fas fa-arrow-alt-circle-up"></i></span>
              </a>
              <a className="level-item has-text-warning" data-comment-id={this.props.comment.id} onClick={this.props.onDownVote}>
                <span className="icon is-small"><i className="fas fa-arrow-alt-circle-down"></i></span>
              </a>
              {this.props.comment.children_count > 0 && <a className="level-item has-text-info" data-comment-id={this.props.comment.id} onClick={this.props.onExpandComment}>
                {!this.props.expanded && <span className="icon"><i className="fas fa-angle-down"></i></span>}
                {this.props.expanded && <span className="icon"><i className="fas fa-angle-up"></i></span>}
              </a>}
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
  const commentData = JSON.parse(homeCommentsData.getAttribute('data-comments'));
  let section = document.createElement('section');
  section.className = 'section';
  const footer = document.getElementById('footer');
  const container = document.body.insertBefore(section, footer);
  render(<Comments comments={commentData} />, container);
});
