import React from 'react';
import {} from 'jquery';
import { render } from 'react-dom';

document.addEventListener('DOMContentLoaded', () => {
  const homeIndexData = document.getElementById('home-index-data');
  const oserData = JSON.parse(homeIndexData.getAttribute('data-osers'));
  const commentData = JSON.parse(homeIndexData.getAttribute('data-comments'));
  let section = document.createElement('section');
  section.className = 'section';
  const footer = document.getElementById('footer');
  const container = document.body.insertBefore(section, footer);
  render(<AdminDashboard osers={oserData} comments={commentData} />, container);
});

export default class AdminDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      osers: this.props.osers,
      comments: this.props.comments,
      newOserToggle: false,
      passwordsMatch: true,
      editingOsers: []
    }

    this._fetchOsers = this._fetchOsers.bind(this);
    this._handleCreateOser = this._handleCreateOser.bind(this);
    this._handleEditOser = this._handleEditOser.bind(this);
    this._handleEditOsername = this._handleEditOsername.bind(this);
    this._handleUpdateOser = this._handleUpdateOser.bind(this);
    this._handleDeleteOser = this._handleDeleteOser.bind(this);
    this._handleToggleNewOser = this._handleToggleNewOser.bind(this);
    this._confirmPasswordMatch = this._confirmPasswordMatch.bind(this);
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

  _handleToggleNewOser() {
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
          this._fetchOsers();
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
          this._fetchOsers();
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
            <td>{oser.joined}</td>
            <td>
              <div className="buttons has-addons">
                <a className="button is-white" data-oser-id={oser.id} onClick={this._handleEditOser}>
                  <span className="icon has-text-info" title="Edit Oser">
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
            <td>{oser.joined}</td>
            <td>
              <div className="buttons has-addons">
                <a className="button is-white" data-oser-id={oser.id} onClick={this._handleEditOser}>
                  <span className="icon has-text-info" title="Edit Oser">
                    <i className="fas fa-edit"></i>
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
    let passwordConfirmationClass = this.state.passwordsMatch ? "input" : "input is-danger";
    return (
      <div className="container">
        <nav className="level">
          <div className="tags has-addons">
            <span className="tag is-primary">Osers</span>
            <span className="tag">{this.state.osers.length}</span>
          </div>
          <h1 className="title">
            Hello, Josh! Welcome back.
          </h1>
          <div className="tags has-addons">
            <span className="tag is-link">Comments</span>
            <span className="tag">{this.state.comments.length}</span>
          </div>
        </nav>
        {!this.state.newOserToggle && <div className="field">
          <p className="control">
            <button className='button' onClick={this._handleToggleNewOser}>New Oser</button>
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
            <div className="tile is-child box">
              <p className="title">Oser Central</p>
              <table className="table is-striped is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th><abbr title="Osername">Oname</abbr></th>
                    <th>Flair</th>
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
                    <th><abbr title="Date Created">Joined</abbr></th>
                    <th>Actions</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className="tile is-parent">
            <div className="tile is-child box">
              <p className="title">Comments</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper diam at erat pulvinar, at pulvinar felis blandit. Vestibulum volutpat tellus diam, consequat gravida libero rhoncus ut. Morbi maximus, leo sit amet vehicula eleifend, nunc dui porta orci, quis semper odio felis ut quam.</p>
              <p>Suspendisse varius ligula in molestie lacinia. Maecenas varius eget ligula a sagittis. Pellentesque interdum, nisl nec interdum maximus, augue diam porttitor lorem, et sollicitudin felis neque sit amet erat. Maecenas imperdiet felis nisi, fringilla luctus felis hendrerit sit amet. Aenean vitae gravida diam, finibus dignissim turpis. Sed eget varius ligula, at volutpat tortor.</p>
              <p>Integer sollicitudin, tortor a mattis commodo, velit urna rhoncus erat, vitae congue lectus dolor consequat libero. Donec leo ligula, maximus et pellentesque sed, gravida a metus. Cras ullamcorper a nunc ac porta. Aliquam ut aliquet lacus, quis faucibus libero. Quisque non semper leo.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
