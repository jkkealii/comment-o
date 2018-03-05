import React from 'react';
import {} from 'jquery';

export default class SampleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      osers: this.props.osers,
      comments: this.props.comments,
      newOserToggle: false
    }

    this._handleCreateOser = this._handleCreateOser.bind(this);
    this._handleNewOser = this._handleNewOser.bind(this);
  }

  _handleNewOser() {
    this.setState({newOserToggle: !this.state.newOserToggle});
  }

  _handleCreateOser() {
    $.ajax({
      url: '/osers',
      type: 'POST',
      dataType: 'JSON',
      data: {
        oser: {
          username: this.newUsername.value,
          password: this.newPassword.value,
          password_confirmation: this.newPasswordConfirmation.value
        }
      },
      success: (data) => {
        alert('New Oser created!');
      },
      error: (xhr) => {
        let errors = $.parseJSON(xhr.responseText).errors;
        alert(errors);
      }
    });
  }

  render() {
    let osers = this.state.osers.map((oser) => {
      return(
        <p key={oser.id}>{oser.username}</p>
      );
    });
    return (
      <div className="container">
        <h1 className="title">
          Hi, I'm SampleComponent!
        </h1>
        {!this.state.newOserToggle && <button className='button' onClick={this._handleNewOser}>New Oser</button>}
        {this.state.newOserToggle && <div>
          <input className='input' placeholder='username' ref={username => this.newUsername = username} />
          <input className='input' placeholder='password' ref={password => this.newPassword = password} />
          <input className='input' placeholder='passwordConfirmation' ref={passwordConfirmation => this.newPasswordConfirmation = passwordConfirmation} />
          <button className='button' onClick={this._handleCreateOser}>Submit Oser</button>
        </div>}
        <p className="subtitle">
          <strong>Oser list:</strong>
        </p>
        {osers}
      </div>
    );
  }
}
