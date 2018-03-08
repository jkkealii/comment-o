import React from 'react';
import {} from 'jquery';
import { render } from 'react-dom';

export default class SignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      passwordsMatch: true,
      username: '',
      password: undefined,
      passwordConfirmation: undefined,
      progress: 0
    }

    this._handleEditOsername = this._handleEditOsername.bind(this);
    this._handlePasswordChange = this._handlePasswordChange.bind(this);
    this._handleCreateOser = this._handleCreateOser.bind(this);
  }

  _handleEditOsername(event) {
    let target = event.currentTarget;
    let username = target.value;
    if (username === '') {
      $(target).addClass('is-danger');
    } else {
      $(target).removeClass('is-danger');
    }
    this.setState({username})
  }

  _handlePasswordChange(event) {
    let target = event.currentTarget;
    let password;
    let passwordConfirmation;
    if (target.id === 'password') {
      password = target.value;
      passwordConfirmation = this.state.passwordConfirmation;
    } else {
      password = this.state.password;
      passwordConfirmation = target.value;
    }
    let progress = password.length;
    let passwordsMatch = passwordConfirmation !== '' && password === passwordConfirmation;
    this.setState({
      passwordsMatch,
      password,
      passwordConfirmation,
      progress
    });
  }

  _handleCreateOser() {
    $.ajax({
      url: '/osers',
      type: 'POST',
      dataType: 'JSON',
      data: {
        oser: {
          username: this.state.username,
          password: this.state.password,
          password_confirmation: this.state.passwordConfirmation
        }
      },
      success: (data) => {
        alert('Sign up successful!');
        window.location = '/';
      },
      error: (xhr) => {
        let errors = $.parseJSON(xhr.responseText).errors;
        alert(errors);
      }
    });
  }

  render() {
    let passwordConfirmationClass = this.state.passwordsMatch ? "input is-large" : "input is-large is-danger";
    let progressClass = "progress is-small help";
    if (this.state.progress > 20) {
      progressClass += " is-success";
    } else if (this.state.progress > 10) {
      progressClass += " is-warning";
    } else {
      progressClass += " is-danger";
    }
    return(
      <div className="container">
        <section class="hero is-primary is-medium">
          <div class="hero-body">
            <div class="container has-text-centered">
              <h1 class="title">
                Come one, come all, join Comment&#8209;O today!
              </h1>
              <h2 class="subtitle">
                Twitter is so 2000s, join the cool kids here!
              </h2>
            </div>
          </div>

          <div class="hero-foot">
            <div className="card">
              <div className="card-content" style={{padding: '3rem'}}>
                <div className="field">
                  <label className="label">Osername</label>
                  <p className="control has-icons-left">
                    <input className="input is-large" type="text" placeholder="Osername" onChange={this._handleEditOsername} value={this.state.username}/>
                    <span className="icon is-small is-left">
                      <i className="fas fa-user-circle"></i>
                    </span>
                  </p>
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <p className="control has-icons-left">
                    <input className="input is-large" id="password" type="password" placeholder="Password" onChange={this._handlePasswordChange}/>
                    <span className="icon is-small is-left">
                      <i className="fas fa-lock"></i>
                    </span>
                  </p>
                  <progress className={progressClass} value={this.state.progress} max="36">{this.state.progress}%</progress>
                </div>
                <div className="field">
                  <label className="label">Password Confirmation</label>
                  <p className="control has-icons-left has-icons-right">
                    <input className={passwordConfirmationClass} type="password" placeholder="Password Confirmation" onChange={this._handlePasswordChange}/>
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
                  <p className="help">There is no way to recover your password once you have entered it here; beware!</p>
                </div>
                <div className="field is-grouped is-grouped-right">
                  <p className="control">
                    <button className="button is-large is-success" onClick={this._handleCreateOser}>
                      Sign Up
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

$(document).ready(() => {
  let section = document.createElement('section');
  section.className = 'section';
  const footer = document.getElementById('footer');
  const container = document.body.insertBefore(section, footer);
  render(<SignUp />, container);
});
