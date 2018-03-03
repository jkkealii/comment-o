import React from 'react';

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
    $(document).ready(function(){
      $('#present').mouseenter(function(){
          alert("MouseEnter!"); // This will create an alert box
          console.log("MouseEnter!"); // This will log to the JS console on your browser which is a bit nicer to read than alerts, you do not need both, just preference
          $(this).fadeIn('fast',1);
      }
      $('#present').mouseleave(function(){
          alert("MouseLeave!"); // This will create an alert box
          console.log("MouseLeave!");
          $(this).fadeIn('fast',0.5);
      }
    });
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
