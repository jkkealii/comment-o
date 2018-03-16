import React from 'react';
import {} from 'jquery';
import { render } from 'react-dom';
import { Comments, Comment, CommentReply } from '../components/Comments';

export class Osers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOser: this.props.currentOser,
      osers: this.props.osers,
      oserCount: this.props.oserCount,
      expandedOsers: [],
      fieldFilters: []
    };

    this._handleViewOserComments = this._handleViewOserComments.bind(this);
    this._handleSearch = this._handleSearch.bind(this);
    this._handleFieldFilter = this._handleFieldFilter.bind(this);
    this._fetchOsers = this._fetchOsers.bind(this);
  }

  _fetchOsers(currentOser = this.state.currentOser, childrenPopulated = null) {
    $.ajax({
      url: '/osers',
      type: 'GET',
      dataType: 'JSON',
      data: {
        expanded_osers: this.state.expandedOsers.join(','),
        children_populated: childrenPopulated
      },
      success: (data) => {
        this.setState({currentOser, osers: data.osers});
      }
    });
  }

  _handleViewOserComments(event) {
    const id = parseInt(event.currentTarget.dataset.oserId);
    let expandedOsers = this.state.expandedOsers;
    if (expandedOsers.includes(id)) {
      let oserIndex = expandedOsers.indexOf(id);
      expandedOsers.splice(oserIndex, 1);
      this.setState({expandedOsers});
    } else {
      expandedOsers.push(id);
      $.ajax({
        url: `/osers/${id}/comments`,
        type: 'GET',
        dataType: 'JSON',
        success: (data) => {
          let osers = this.state.osers;
          let oser;
          for (let i = 0; i < osers.length; i++) {
            if (osers[i].id === id) {
              osers[i] = data.oser;
              break;
            }
          }
          this.setState({osers, expandedOsers});
        },
        error: (xhr) => {
          let errors = $.parseJSON(xhr.responseText).errors;
          alert(errors);
        }
      });
    }
  }

  _handleSearch() {
    let query = this.searchQuery.value;
    let fields = this.state.fieldFilters.join(',');
    $.ajax({
      url: '/osers/search',
      type: 'GET',
      dataType: 'JSON',
      data: {
        query: query,
        fields: fields
      },
      success: (data) => {
        this.setState({osers: data.osers, expandedOsers: []});
      },
      error: (xhr) => {
        let errors = $.parseJSON(xhr.responseText).errors;
        alert(errors);
      }
    });
  }

  _handleFieldFilter(event) {
    let field = event.currentTarget.dataset.field;
    let fieldFilters = this.state.fieldFilters;
    if (field === 'reset') {
      this.setState({fieldFilters: []});
    } else if (fieldFilters.includes(field)) {
      fieldFilters.splice(fieldFilters.indexOf(field), 1);
      this.setState({fieldFilters});
    } else {
      fieldFilters.push(field);
      this.setState({fieldFilters});
    }
    if (this.searchQuery.value.length > 0) {
      this._handleSearch();
    }
  }

  render() {
    let osers = this.state.osers.map((oser) => {
      return(
        <Oser
          key={oser.id}
          currentOser={this.state.currentOser}
          loggedIn={this.props.loggedIn}
          oser={oser}
          expanded={this.state.expandedOsers.includes(oser.id)}
          onViewOserComments={this._handleViewOserComments}
          onRefresh={this._fetchOsers}
        />
      );
    });
    return(
      <div className={this.props.module ? "" : "container"}>
        {!this.props.module && <section className="hero is-primary is-bold" style={{marginBottom: '1rem'}}>
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                Total Oser count:
              </h1>
              <h2 className="subtitle">
                {this.state.oserCount}
              </h2>
            </div>
          </div>
        </section>}
        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <form action="javascript:void(0);">
                <div className="field has-addons">
                  <p className="control">
                    <input className="input" type="text" placeholder="Search for osers" ref={searchQuery => this.searchQuery = searchQuery}/>
                  </p>
                  <p className="control">
                    <button type="submit" className="button is-primary" onClick={this._handleSearch}>
                      Search
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
          <div className="level-item">
            <div className="box" style={{marginTop: '0.5rem'}}>
              <div className="buttons">
                <label className="label" style={{marginRight: '1rem'}}>Search fields:</label>
                <span className={this.state.fieldFilters.includes('osername') ? 'button is-small is-active' : 'button is-small'} onClick={this._handleFieldFilter} data-field="osername">Osername</span>
                <span className={this.state.fieldFilters.includes('flair') ? 'button is-small is-active' : 'button is-small'} onClick={this._handleFieldFilter} data-field="flair">Flair</span>
                <span className="button is-small is-danger is-outlined" onClick={this._handleFieldFilter} data-field="reset">Reset</span>
              </div>
            </div>
          </div>
        </nav>
        {osers}
      </div>
    );
  }
}

export class Oser extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let comments =
      <Comments
        comments={this.props.oser.comments}
        commentCount={this.props.oser.comments_count}
        currentOser={this.props.currentOser}
        loggedIn={this.props.loggedIn}
        module={true}
        onRefresh={this.props.onRefresh}
        showNewComment={false}
      />;
    return(
      <div className="box">
        <article className="media">
          <figure className="media-left" onClick={() => window.open(`/osers/${this.props.oser.id}`)}>
            <a className="icon is-large" style={{color: this.props.oser.flair_color !== null ? this.props.oser.flair_color : '#209CEE'}}>
              <i className="fas fa-3x fa-user-circle"></i>
            </a>
          </figure>
          <div className="media-content">
            <div className="content" style={{width: '100%'}} onClick={() => window.open(`/osers/${this.props.oser.id}`)}>
              <a style={{color: 'unset'}}>
                <strong>{this.props.oser.username}</strong>
                {this.props.oser.flair !== null &&
                  <small className={this.props.oser.flair_color !== null ? 'subtitle is-6' : 'subtitle is-6 has-text-info'} style={{color: this.props.oser.flair_color, verticalAlign: 'super', fontSize: '0.75rem'}}>
                    &nbsp;- {this.props.oser.flair}
                  </small>
                }
              </a>
            </div>
            <div className="content">
              <div className="field is-grouped is-grouped-multiline">
                <div className="control">
                  <div className="tags has-addons">
                    <span className="tag is-info">Comments</span>
                    <span className="tag">{this.props.oser.comments_count}</span>
                  </div>
                </div>

                <div className="control">
                  <div className="tags has-addons">
                    <span className="tag is-primary">Score-O</span>
                    <span className="tag is-dark">0</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '0.75rem'}}>
              <div className="content is-small" style={{display: 'inline', marginBottom: 'unset'}}>
                Joined: <time dateTime={this.props.oser.joined.datetime}>{this.props.oser.joined.formatted}</time>
              </div>
              {this.props.oser.comments_count > 0 && <a className="has-text-info" data-oser-id={this.props.oser.id} onClick={this.props.onViewOserComments} style={{marginLeft: '1rem'}}>
                {!this.props.expanded && <span className="icon" title={`${this.props.oser.comments_count} comments`}><i className="fas fa-lg fa-angle-down"></i></span>}
                {this.props.expanded && <span className="icon" title={`${this.props.oser.comments_count} comments`}><i className="fas fa-lg fa-angle-up"></i></span>}
              </a>}
            </div>
            {this.props.expanded && comments}
          </div>
          <div className="media-right">
            <div className="content is-small">
            </div>
          </div>
        </article>
      </div>
    );
  }
}

$(document).ready(() => {
  const homeOsersData = document.getElementById('home-osers-data');
  const osersData = JSON.parse(homeOsersData.getAttribute('data-osers'));
  const oserCountData = JSON.parse(homeOsersData.getAttribute('data-oser-count'));
  const currentOserData = JSON.parse(homeOsersData.getAttribute('data-current-oser'));
  const loggedInData = JSON.parse(homeOsersData.getAttribute('data-logged-in'));
  let section = document.createElement('section');
  section.className = 'section';
  const footer = document.getElementById('footer');
  const container = document.body.insertBefore(section, footer);
  render(
    <Osers
      osers={osersData}
      oserCount={oserCountData}
      currentOser={currentOserData}
      loggedIn={loggedInData}
      module={false}
    />,
    container
  );
});
