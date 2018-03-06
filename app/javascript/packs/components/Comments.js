import React from 'react';
import {} from 'jquery';
import { render } from 'react-dom';

export default class Comments extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <h1>COMMENTS</h1>
    );
  }
}

$(document).ready(() => {
  const homeCommentsData = document.getElementById('home-comments-data');
  const commentData = JSON.parse(homeCommentsData.getAttribute('data-comments'));
  let section = document.createElement('section');
  section.className = 'section';
  const footer = document.getElementById('footer');
  const container = document.body.insertBefore(section, footer);
  render(<Comments comments={commentData} />, container);
});
