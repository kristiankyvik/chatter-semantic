import React from 'react';

const Loader = React.createClass({
  render () {
    const loaderClasses = this.props.small ? "ui text loader mini" : "ui loader";
    return (
      <div className="ui active inverted dimmer">
        <div className={loaderClasses}>
          {this.props.small ? "loading messages" : null}
        </div>
      </div>
    );
  }
});

export default Loader;
