import React from 'react';
import {} from 'jquery';
import { render } from 'react-dom';
import { Comments, Comment, CommentReply } from '../components/Comments';
import { BlockPicker } from 'react-color';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOser: this.props.currentOser,
      oser: this.props.oser
    }

    this._fetchOser = this._fetchOser.bind(this);
    this._handleChangeComplete = this._handleChangeComplete.bind(this);
    this._handleColorPickerToggle = this._handleColorPickerToggle.bind(this);
    this._handleSwatchHover = this._handleSwatchHover.bind(this);
  }

  _fetchOser(currentOser = this.state.currentOser, childrenPopulated = null) {
    $.ajax({
      url: `/osers/${this.state.currentOser.id}`,
      type: 'GET',
      dataType: 'JSON',
      data: {
        children_populated: childrenPopulated
      },
      success: (data) => {
        this.setState({currentOser, oser: data.oser});
      },
      error: (xhr) => {
        let errors = $.parseJSON(xhr.responseText).errors;
        alert(errors);
      }
    });
  }

  _handleColorPickerToggle() {
    this.setState({colorPickerActive: !this.state.colorPickerActive});
  }

  _handleSwatchHover(color, event) {
    let oser = this.state.oser;
    oser.flair_color = color.hex;
    this.setState({oser});
  }

  _handleChangeComplete(color) {
    let oser = this.state.oser;
    oser.flair_color = color.hex;
    $.ajax({
      url: `/osers/${this.state.currentOser.id}`,
      type: 'PATCH',
      dataType: 'JSON',
      data: {
        oser: {
          flair_color: color.hex
        }
      },
      success: (data) => {
        this.setState({colorPickerActive: false});
        this._fetchOser();
      },
      error: (xhr) => {
        let errors = $.parseJSON(xhr.responseText).errors;
        alert(errors);
      }
    });
  }

  render() {
    let currentOserProfile = this.props.loggedIn && this.state.currentOser.id === this.state.oser.id;
    let subtitle = "doesn't have any comments yet-o!";
    let commentCount = this.state.oser.comments_count;
    if (commentCount === 1) {
      subtitle = `has ${commentCount} comment!`;
    } else if (commentCount > 1) {
      subtitle = `has ${commentCount} comments!`;
    }
    let comments =
      <Comments
        comments={this.state.oser.comments}
        commentCount={this.state.oser.comments_count}
        currentOser={this.state.currentOser}
        loggedIn={this.props.loggedIn}
        module={true}
        onRefresh={this._fetchOser}
        showNewComment={false}
      />;
    let defaultColors = ['#23D160', '#FFDD57', '#00D1B2', '#FF3860', '#555555', '#dce775', '#ff8a65', '#ba68c8', '#209CEE'];
    if (this.state.oser.flair_color !== null && !defaultColors.includes(this.state.oser.flair_color)) {
      defaultColors.push(this.state.oser.flair_color);
    }
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
                  <h3 className="level-item title is-5">Flair color:</h3>
                </div>
                <div className="level-right">
                  {!this.state.colorPickerActive && currentOserProfile && <a onClick={this._handleColorPickerToggle}>
                    <h5 className={this.state.oser.flair_color !== null ? 'level-item subtitle is-6' : 'level-item subtitle is-6 has-text-info'} style={{color: this.state.oser.flair_color}}>
                      <span className="icon">
                        <i className="fas fa-square"></i>
                      </span>
                      {this.state.oser.flair_color === null ? '#209cee' : this.state.oser.flair_color}
                    </h5>
                  </a>}
                  {!currentOserProfile &&
                    <h5 className={this.state.oser.flair_color !== null ? 'level-item subtitle is-6' : 'level-item subtitle is-6 has-text-info'} style={{color: this.state.oser.flair_color}}>
                      <span className="icon">
                        <i className="fas fa-square"></i>
                      </span>
                      {this.state.oser.flair_color === null ? '#209cee' : this.state.oser.flair_color}
                    </h5>
                  }
                  {currentOserProfile && this.state.colorPickerActive &&
                    <div className="level-item">
                      <BlockPicker
                        color={this.state.oser.flair_color !== null ? this.state.oser.flair_color : '#209cee'}
                        onChangeComplete={this._handleChangeComplete}
                        triangle='hide'
                        colors={defaultColors}
                        onSwatchHover={this._handleSwatchHover}
                      />
                    </div>
                  }
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
                {this.state.oser.flair !== null && <small className={this.state.oser.flair_color !== null ? 'subtitle' : 'subtitle has-text-info'} style={{verticalAlign: 'super', fontSize: '0.75rem', color: this.state.oser.flair_color}}>&nbsp;- {this.state.oser.flair}</small>}
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
