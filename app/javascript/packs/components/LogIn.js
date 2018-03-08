import React from 'react';
import {} from 'jquery';
import { render } from 'react-dom';

export default class LogIn extends React.Component {
  constructor() {
    super();
    this.state = {
      username: undefined,
      password: undefined,
    }

    this._handleEditOsername = this._handleEditOsername.bind(this);
    this._handlePasswordChange = this._handlePasswordChange.bind(this);
    this._handleLogIn = this._handleLogIn.bind(this);
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
    let password = target.value;
    this.setState({password});
  }

  _handleLogIn() {
    $.ajax({
      url: '/login',
      type: 'POST',
      dataType: 'JSON',
      data: {
        session: {
          username: this.state.username,
          password: this.state.password
        }
      },
      success: (data) => {
        alert('Log in successful!');
        window.location = '/';
      },
      error: (xhr) => {
        let errors = $.parseJSON(xhr.responseText).errors;
        alert(errors);
      }
    });
  }

  render() {
    return(
      <div className="container">
        <section className="hero is-light is-bold">
          <div className="hero-body">
            <div className="container has-text-centered">
              <h1 className="title">
                Welcome back, fellow Comment&#8209;O'er!
              </h1>
              <h2 className="subtitle">
                Tell your friends about the newest, coolest hip internet place. (Here. Comment&#8209;O)
              </h2>
            </div>
          </div>
        </section>
        <form action="javascript:void(0);" style={{padding: '3rem'}}>
          <div className="field">
            <label className="label">Osername</label>
            <p className="control has-icons-left">
              <input className="input is-large" type="text" placeholder="Osername" onChange={this._handleEditOsername}/>
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
          </div>
          <nav className="level">
            <div className="level-left">
              <div className="level-item content">
                <p>Don't have an account&#8209;o? Sign up&nbsp;<a onClick={() => window.location = '/signup'}>here</a></p>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <div className="field is-grouped is-grouped-right">
                  <p className="control">
                    <button type="submit" className="button is-large is-success" onClick={this._handleLogIn}>
                      Log In
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </nav>
        </form>
      </div>
    );
  }
}

$(document).ready(() => {
  let section = document.createElement('section');
  section.className = 'section';
  const footer = document.getElementById('footer');
  const container = document.body.insertBefore(section, footer);
  render(<LogIn />, container);
});
