Widget = React.createClass({

  render() {

    return (
      <div className="ui button primary chatter-open" onClick={this.props.toggleChatState}>
        <i className="comments outline icon"></i>
      </div>
    );
  }
});
