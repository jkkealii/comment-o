import React from 'react';
import {} from 'jquery';
import { render } from 'react-dom';

export default class AdminDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      osers: this.props.osers,
      comments: this.props.comments,
      newOserToggle: false,
      newCommentOser: null,
      passwordsMatch: true,
      editingOsers: [],
      editingComments: []
    }

    this._fetchAll = this._fetchAll.bind(this);
    this._fetchOsers = this._fetchOsers.bind(this);
    this._fetchComments = this._fetchComments.bind(this);

    this._handleCreateOser = this._handleCreateOser.bind(this);
    this._handleEditOser = this._handleEditOser.bind(this);
    this._handleUpdateOser = this._handleUpdateOser.bind(this);
    this._handleDeleteOser = this._handleDeleteOser.bind(this);

    this._handleEditOsername = this._handleEditOsername.bind(this);
    this._handleToggleNewOser = this._handleToggleNewOser.bind(this);
    this._confirmPasswordMatch = this._confirmPasswordMatch.bind(this);

    this._handleNewComment = this._handleNewComment.bind(this);
    this._handleCreateComment = this._handleCreateComment.bind(this);
    this._handleEditComment = this._handleEditComment.bind(this);
    this._handleUpdateComment = this._handleUpdateComment.bind(this);
    this._handleDeleteComment = this._handleDeleteComment.bind(this);
  }

  _fetchAll() {
    $.ajax({
      url: '/',
      type: 'GET',
      dataType: 'JSON',
      success: (data) => {
        this.setState({osers: data.osers, comments: data.comments});
      }
    });
  }

  _fetchOsers() {
    $.ajax({
      url: '/osers',
      type: 'GET',
      dataType: 'JSON',
      success: (data) => {
        this.setState({osers: data.osers});
      }
    });
  }

  _fetchComments() {
    $.ajax({
      url: '/comments',
      type: 'GET',
      dataType: 'JSON',
      data: {
        top_level: false,
        limit: 5
      },
      success: (data) => {
        this.setState({comments: data.comments});
      }
    });
  }

  _handleToggleNewOser() {
    this.setState({newOserToggle: !this.state.newOserToggle});
  }

  _handleCreateOser() {
    $.ajax({
      url: '/osers',
      type: 'POST',
      dataType: 'JSON',
      data: {
        admin: true,
        oser: {
          username: this.newUsername.value,
          password: this.newPassword.value,
          password_confirmation: this.newPasswordConfirmation.value
        }
      },
      success: (data) => {
        alert('New Oser created!');
        this._fetchOsers();
        this.setState({newOserToggle: false});
      },
      error: (xhr) => {
        let errors = $.parseJSON(xhr.responseText).errors;
        alert(errors);
      }
    });
  }

  _handleEditOser(event) {
    const id = parseInt(event.currentTarget.dataset.oserId);
    let editingOsers = this.state.editingOsers;
    if (editingOsers.includes(id)) {
      let oserIndex = editingOsers.indexOf(id);
      editingOsers.splice(oserIndex, 1);
    } else {
      editingOsers.push(id);
    }
    this.setState({editingOsers});
  }

  _handleUpdateOser(event) {
    const id = parseInt(event.currentTarget.dataset.oserId);
    let username = this[`username_${id}`].value;
    let flair = this[`flair_${id}`].value;
    let oser;
    for (let i = 0; i < this.state.osers.length; i++) {
      oser = this.state.osers[i];
      if (parseInt(oser.id) === id) {
        break;
      }
    }
    if (username === oser.username && flair === oser.flair) {
      let editingOsers = this.state.editingOsers;
      let oserIndex = editingOsers.indexOf(id);
      editingOsers.splice(oserIndex, 1);
      alert('No changes made');
      this.setState({editingOsers});
    } else {
      $.ajax({
        url: `/osers/${id}`,
        type: 'PATCH',
        dataType: 'JSON',
        data: {
          oser: {
            username: username,
            flair: flair
          }
        },
        success: (data) => {
          let editingOsers = this.state.editingOsers;
          let oserIndex = editingOsers.indexOf(id);
          editingOsers.splice(oserIndex, 1);
          alert('Oser updated!');
          this.setState({editingOsers});
          this._fetchAll();
        },
        error: (xhr) => {
          let errors = $.parseJSON(xhr.responseText).errors;
          alert(errors);
        }
      });
    }
  }

  _handleDeleteOser(event) {
    const id = event.currentTarget.dataset.oserId;
    if (confirm('Are you sure you want to delete this Oser?')) {
      $.ajax({
        url: `/osers/${id}`,
        type: 'DELETE',
        dataType: 'JSON',
        success: (data) => {
          alert('Oser deleted!');
          this._fetchAll();
        },
        error: (xhr) => {
          let errors = $.parseJSON(xhr.responseText).errors;
          alert(errors);
        }
      });
    }
  }

  _handleNewComment(event) {
    const id = parseInt(event.currentTarget.dataset.oserId);
    const username = event.currentTarget.dataset.oserUsername;
    this.setState({newCommentOser: {id: id, username: username}});
  }

  _handleCreateComment() {
    $.ajax({
      url: '/comments',
      type: 'POST',
      dataType: 'JSON',
      data: {
        comment: {
          oser_id: this.state.newCommentOser.id,
          content: this.newComment.value
        }
      },
      success: (data) => {
        alert('New Comment created!');
        this._fetchAll();
        this.setState({newCommentOser: null});
      },
      error: (xhr) => {
        let errors = $.parseJSON(xhr.responseText).errors;
        alert(errors);
      }
    });
  }

  _handleEditComment(event) {
    const id = parseInt(event.currentTarget.dataset.commentId);
    let editingComments = this.state.editingComments;
    if (editingComments.includes(id)) {
      let oserIndex = editingComments.indexOf(id);
      editingComments.splice(oserIndex, 1);
    } else {
      editingComments.push(id);
    }
    this.setState({editingComments});
  }

  _handleUpdateComment(event) {
    const id = parseInt(event.currentTarget.dataset.commentId);
    let content = this[`comment_${id}`].value;
    let comment;
    for (let i = 0; i < this.state.comments.length; i++) {
      comment = this.state.comments[i];
      if (parseInt(comment.id) === id) {
        break;
      }
    }
    if (content === comment.content) {
      let editingComments = this.state.editingComments;
      let commentIndex = editingComments.indexOf(id);
      editingComments.splice(commentIndex, 1);
      alert('No changes made');
      this.setState({editingComments});
    } else {
      $.ajax({
        url: `/comments/${id}`,
        type: 'PATCH',
        dataType: 'JSON',
        data: {
          comment: {
            edited: true,
            content: content
          }
        },
        success: (data) => {
          let editingComments = this.state.editingComments;
          let commentIndex = editingComments.indexOf(id);
          editingComments.splice(commentIndex, 1);
          alert('Comment updated!');
          this.setState({editingComments});
          this._fetchComments();
        },
        error: (xhr) => {
          let errors = $.parseJSON(xhr.responseText).errors;
          alert(errors);
        }
      });
    }
  }

  _handleDeleteComment(event) {
    const id = event.currentTarget.dataset.commentId;
    if (confirm('Are you sure you want to delete this Comment?')) {
      $.ajax({
        url: `/comments/${id}`,
        type: 'DELETE',
        dataType: 'JSON',
        success: (data) => {
          alert('Comment deleted!');
          this._fetchAll();
        },
        error: (xhr) => {
          let errors = $.parseJSON(xhr.responseText).errors;
          alert(errors);
        }
      });
    }
  }

  _handleEditOsername(event) {
    let target = event.currentTarget;
    if (target.value === '') {
      $(target).addClass('is-danger');
    } else {
      $(target).removeClass('is-danger');
    }
  }

  _confirmPasswordMatch() {
    const password = this.newPassword.value;
    let passwordConfirmation = this.newPasswordConfirmation.value;
    this.setState({passwordsMatch: passwordConfirmation !== '' && password === passwordConfirmation});
  }

  render() {
    let osers = this.state.osers.map((oser) => {
      if (this.state.editingOsers.includes(oser.id)) {
        return(
          <tr key={`edit_${oser.id}`}>
            <td><input className="input" type="text" ref={username => this[`username_${oser.id}`] = username} onChange={this._handleEditOsername} defaultValue={oser.username}></input></td>
            <td><input className="input" type="text" ref={flair => this[`flair_${oser.id}`] = flair} defaultValue={oser.flair}></input></td>
            <td>{oser.comments.length}</td>
            <td>{oser.joined}</td>
            <td>
              <div className="buttons has-addons">
                <a className="button is-white" data-oser-id={oser.id} onClick={this._handleEditOser}>
                  <span className="icon has-text-link" title="Edit Oser">
                    <i className="fas fa-edit"></i>
                  </span>
                </a>
                <a className="button is-white" data-oser-id={oser.id} onClick={this._handleUpdateOser}>
                  <span className="icon has-text-success" title="Update Oser">
                    <i className="fas fa-check"></i>
                  </span>
                </a>
                <a className="button is-white" data-oser-id={oser.id} onClick={this._handleDeleteOser}>
                  <span className="icon has-text-danger" title="Delete Oser">
                    <i className="fas fa-times"></i>
                  </span>
                </a>
              </div>
            </td>
          </tr>
        );
      } else {
        return(
          <tr key={oser.id}>
            <td>{oser.username}</td>
            <td>{oser.flair === null ? 'None' : oser.flair}</td>
            <td>{oser.comments.length}</td>
            <td>{oser.joined}</td>
            <td>
              <div className="buttons has-addons">
                <a className="button is-white" data-oser-id={oser.id} onClick={this._handleEditOser}>
                  <span className="icon has-text-link" title="Edit Oser">
                    <i className="fas fa-edit"></i>
                  </span>
                </a>
                <a className="button is-white" data-oser-id={oser.id} data-oser-username={oser.username} onClick={this._handleNewComment}>
                  <span className="icon has-text-info" title="New Comment">
                    <i className="fas fa-plus"></i>
                  </span>
                </a>
                <a className="button is-white" data-oser-id={oser.id} onClick={this._handleDeleteOser}>
                  <span className="icon has-text-danger" title="Delete Oser">
                    <i className="fas fa-times"></i>
                  </span>
                </a>
              </div>
            </td>
          </tr>
        );
      }
    });
    let comments = this.state.comments.map((comment, index) => {
      if (this.state.editingComments.includes(comment.id)) {
        let cardStyle = null;
        if (index > 0) {
          cardStyle = {
            marginTop: '10px'
          };
        }
        return(
          <div className="card" style={cardStyle} key={`edit_${comment.id}`}>
            <header className="level card-header">
              <div className="level-left">
                <h5 className="level-item card-header-title">
                  {comment.oser.username}
                  {comment.oser.flair !== null && <p className="subtitle has-text-info" style={{verticalAlign: 'super', fontSize: '0.75rem'}}>&nbsp;- {comment.oser.flair}</p>}
                </h5>
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
                        <span className="tag is-success">{comment.ups}</span>
                      </div>
                    </div>
                    <div className="control">
                      <div className="tags has-addons">
                        <span className="tag">
                          <span className="icon">
                            <i className="fas fa-arrow-alt-circle-down"></i>
                          </span>
                        </span>
                        <span className="tag is-warning">{comment.downs}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <div className="card-content">
              <div className="content">
                <textarea className="textarea" ref={content => this[`comment_${comment.id}`] = content} defaultValue={comment.content}></textarea>
                <br/>
                <nav className="level">
                  <div className="level-left">
                    <div className="level-item content is-small">
                      <time dateTime={comment.posted.datetime}>{comment.posted.formatted}</time>
                    </div>
                  </div>
                  <div className="level-right">
                    <div className="content is-small">
                      {comment.edited && <time dateTime={comment.updated.datetime}>Edited: {comment.updated.formatted}</time>}
                    </div>
                  </div>
                </nav>
              </div>
            </div>
            <footer className="card-footer">
              <a data-comment-id={comment.id} className="card-footer-item has-text-success" onClick={this._handleUpdateComment}>Save</a>
              <a data-comment-id={comment.id} className="card-footer-item" onClick={this._handleEditComment}>Edit</a>
              <a data-comment-id={comment.id} className="card-footer-item has-text-danger" onClick={this._handleDeleteComment}>Delete</a>
            </footer>
          </div>
        );
      } else {
        let cardStyle = null;
        if (index > 0) {
          cardStyle = {
            marginTop: '10px'
          };
        }
        return(
          <div className="card" style={cardStyle} key={comment.id}>
            <header className="level card-header">
              <div className="level-left">
                <h5 className="level-item card-header-title">
                  {comment.oser.username}
                  {comment.oser.flair !== null && <p className="subtitle has-text-info" style={{verticalAlign: 'super', fontSize: '0.75rem'}}>&nbsp;- {comment.oser.flair}</p>}
                </h5>
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
                        <span className="tag is-success">{comment.ups}</span>
                      </div>
                    </div>
                    <div className="control">
                      <div className="tags has-addons">
                        <span className="tag">
                          <span className="icon">
                            <i className="fas fa-arrow-alt-circle-down"></i>
                          </span>
                        </span>
                        <span className="tag is-warning">{comment.downs}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <div className="card-content">
              <div className="content">
                {comment.content}
                <br/>
                <nav className="level">
                  <div className="level-left">
                    <div className="level-item content is-small">
                      <time dateTime={comment.posted.datetime}>{comment.posted.formatted}</time>
                    </div>
                  </div>
                  <div className="level-right">
                    <div className="level-item content is-small">
                      {comment.edited && <time dateTime={comment.updated.datetime}>Edited: {comment.updated.formatted}</time>}
                    </div>
                  </div>
                </nav>
              </div>
            </div>
            <footer className="card-footer">
              <a data-comment-id={comment.id} className="card-footer-item" onClick={this._handleEditComment}>Edit</a>
              <a data-comment-id={comment.id} className="card-footer-item has-text-danger" onClick={this._handleDeleteComment}>Delete</a>
            </footer>
          </div>
        );
      }
    });
    let passwordConfirmationClass = this.state.passwordsMatch ? "input" : "input is-danger";
    let newCommentModal = null;
    if (this.state.newCommentOser !== null) {
      newCommentModal =
        <div className="modal is-active">
          <div className="modal-background" onClick={() => this.setState({newCommentOser: null})}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">New Comment</p>
              <button className="delete" aria-label="close" onClick={() => this.setState({newCommentOser: null})}></button>
            </header>
            <section className="modal-card-body">
              <div className="field">
                <label className="label">Oser</label>
                <div className="control">
                  <input className="input" type="text" placeholder={this.state.newCommentOser.username} disabled />
                </div>
              </div>
              <div className="field">
                <label className="label">Comment</label>
                <div className="control">
                  <textarea className="textarea" placeholder="Comment content" ref={newComment => this.newComment = newComment}></textarea>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-success" onClick={this._handleCreateComment}>Submit</button>
              <button className="button" onClick={() => this.setState({newCommentOser: null})}>Cancel</button>
            </footer>
          </div>
        </div>
    }
    return (
      <div className="container">
        {newCommentModal}
        <nav className="level">
          <div className="tags has-addons">
            <span className="tag is-primary">Osers</span>
            <span className="tag">{this.state.osers.length}</span>
          </div>
          <h1 className="title">
            Hello, Josh! Welcome back.
          </h1>
          <div className="tags has-addons">
            <span className="tag is-info">Comments</span>
            <span className="tag">{this.props.commentCount}</span>
          </div>
        </nav>
        {!this.state.newOserToggle && <div className="field">
          <p className="control">
            <button className='button is-primary' onClick={this._handleToggleNewOser}>New Oser</button>
          </p>
        </div>}
        {this.state.newOserToggle && <div className="field is-grouped">
            <p className="control is-expanded has-icons-left">
              <input className="input" type="text" placeholder="Osername" onChange={this._handleEditOsername} ref={username => this.newUsername = username}/>
              <span className="icon is-small is-left">
                <i className="fas fa-user-circle"></i>
              </span>
            </p>
            <p className="control is-expanded has-icons-left">
              <input className="input" type="password" placeholder="Password" onChange={this._confirmPasswordMatch} ref={password => this.newPassword = password}/>
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
            <p className="control is-expanded has-icons-left has-icons-right">
              <input className={passwordConfirmationClass} type="password" placeholder="Password Confirmation" onChange={this._confirmPasswordMatch} ref={passwordConfirmation => this.newPasswordConfirmation = passwordConfirmation}/>
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
              {this.state.passwordsMatch && <span className="icon is-small is-right">
                <i className="fas fa-check"></i>
              </span>}
              {!this.state.passwordsMatch && <span className="icon is-small is-right">
                <i className="fas fa-times"></i>
              </span>}
            </p>
            <p className="control">
              <button className="button is-success" onClick={this._handleCreateOser}>
                Submit
              </button>
            </p>
            <p className="control">
              <button className="button is-light" onClick={this._handleToggleNewOser}>
                Cancel
              </button>
            </p>
        </div>}
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box" style={{overflowX: 'auto'}}>
              <p className="title">Oser Central</p>
              <table className="table is-striped is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th><abbr title="Osername">Oname</abbr></th>
                    <th>Flair</th>
                    <th><abbr title="Comments">Cmmts</abbr></th>
                    <th><abbr title="Date Created">Joined</abbr></th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {osers}
                </tbody>
                <tfoot>
                  <tr>
                    <th><abbr title="Osername">Oname</abbr></th>
                    <th>Flair</th>
                    <th><abbr title="Comments">Cmmts</abbr></th>
                    <th><abbr title="Date Created">Joined</abbr></th>
                    <th>Actions</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className="tile is-parent">
            <div className="tile is-child box">
              <p className="title">Recent Comments</p>
              {comments}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

$(document).ready(() => {
  const homeIndexData = document.getElementById('home-index-data');
  const oserData = JSON.parse(homeIndexData.getAttribute('data-osers'));
  const commentData = JSON.parse(homeIndexData.getAttribute('data-comments'));
  const commentCountData = JSON.parse(homeIndexData.getAttribute('data-comment-count'));
  const currentOserData = JSON.parse(homeIndexData.getAttribute('data-current-oser'));
  const loggedInData = JSON.parse(homeIndexData.getAttribute('data-logged-in'));
  let section = document.createElement('section');
  section.className = 'section';
  const footer = document.getElementById('footer');
  const container = document.body.insertBefore(section, footer);
  render(
    <AdminDashboard
      osers={oserData}
      comments={commentData}
      commentCount={commentCountData}
      currentOser={currentOserData}
      loggedIn={loggedInData}
    />,
    container
  );
});
