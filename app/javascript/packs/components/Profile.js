import React from 'react';
import {} from 'jquery';
import { render } from 'react-dom';
import {Comments, Comment, CommentReply} from '../components/Comments';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oser: this.props.oser
    }
  }

  render() {
    let subtitle = "doesn't have any comments yet-o!";
    let commentCount = this.state.oser.comments.length + this.state.oser.replies.length;
    if (commentCount === 1) {
      subtitle = `has ${commentCount} comment!`;
    } else if (commentCount > 1) {
      subtitle = `has ${commentCount} comments!`;
    }
    let comments =
      <Comments
        comments={this.state.oser.comments}
        commentCount={this.state.oser.comments.length}
        currentOser={this.props.currentOser}
        loggedIn={this.props.loggedIn}
        module={true}
        showNewComment={false}
      />;
    return(
      <div className="container">
        <section className="hero is-primary is-bold" style={{marginBottom: '1.5rem'}}>
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                {this.state.oser.username}
              </h1>
              <h2 className="subtitle">
                {subtitle}
              </h2>
            </div>
          </div>
        </section>
        <div className="tile is-ancestor">
          <div className="tile is-8 is-vertical is-parent">
            <div className="tile is-child box">
              {comments}
            </div>
            <div className="tile is-child box">
              <p>replies - coming soon!</p>
            </div>
          </div>
          <div className="tile is-parent">
            <div className="tile is-child box">
              <h3 className="title is-3">{this.state.oser.username}</h3>
              <nav className="level">
                <div className="level-left">
                  <h3 className="level-item title is-4">Flair:</h3>
                </div>
                <div className="level-right">
                  <h5 className="level-item subtitle is-6">{this.state.oser.flair}</h5>
                </div>
              </nav>
              <nav className="level">
                <div className="level-left">
                  <h3 className="level-item title is-4">Joined:</h3>
                </div>
                <div className="level-right">
                  <h5 className="level-item subtitle is-6"><time dateTime={this.state.oser.joined.datetime}>{this.state.oser.joined.formatted}</time></h5>
                </div>
              </nav>
              <nav className="level">
                <div className="level-left">
                  <h3 className="level-item title is-4">Total Comments:</h3>
                </div>
                <div className="level-right">
                  <h5 className="level-item subtitle is-6">{commentCount}</h5>
                </div>
              </nav>
              <br/>
              <div className="content box">
                <strong>{this.state.oser.username}</strong>
                {this.state.oser.flair !== null && <small className="subtitle has-text-info" style={{verticalAlign: 'super', fontSize: '0.75rem'}}>&nbsp;- {this.state.oser.flair}</small>}
                <br/>
                osername/flair preview
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

$(document).ready(() => {
  const profileData = document.getElementById('profile-data');
  const oserData = JSON.parse(profileData.getAttribute('data-oser'));
  const currentOserData = JSON.parse(profileData.getAttribute('data-current-oser'));
  const loggedInData = JSON.parse(profileData.getAttribute('data-logged-in'));
  let section = document.createElement('section');
  section.className = 'section';
  const footer = document.getElementById('footer');
  const container = document.body.insertBefore(section, footer);
  render(
    <Profile
      oser={oserData}
      currentOser={currentOserData}
      loggedIn={loggedInData}
    />,
    container
  );
});
