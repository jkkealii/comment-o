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

  componentDidMount() {
    $('div').length
  }

  _handleNewOser() {
    this.setState({newOserToggle: !this.state.newOserToggle});
  }

  _handleCreateOser() {
    console.log(this.newUsername.value);
    console.log(this.newPassword.value);
    console.log(this.newPasswordConfirmation.value);
  }

  render() {
    let osers = this.state.osers.map((oser) => {
      return(
        <p key={oser.id}>{oser.username}</p>
      );
    });
    return (
      <div>
        <h2>Hi, I'm SampleComponent!</h2>
        {!this.state.newOserToggle && <button onClick={this._handleNewOser}>New Oser</button>}
        {this.state.newOserToggle && <div>
          <input placeholder='username' ref={username => this.newUsername = username} />
          <input placeholder='password' ref={password => this.newPassword = password} />
          <input placeholder='passwordConfirmation' ref={passwordConfirmation => this.newPasswordConfirmation = passwordConfirmation} />
          <button onClick={this._handleCreateOser}>Submit Oser</button>
        </div>}
        <h3>Oser list:</h3>
        {osers}
      </div>
    );
  }
}
