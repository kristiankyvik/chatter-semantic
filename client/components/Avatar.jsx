import React from 'react';

const Avatar = React.createClass({

  render() {
    return (
      <div className="avatar-wrapper">
        <div className="status"></div>
        <img className="ui avatar image" src={this.props.avatar} />
      </div>
    );
  }
});

export default Avatar;
