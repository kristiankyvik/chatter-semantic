Nav = React.createClass({

  doNavAction(action) {
    this.props.doNavAction(action);
  },

  render() {

    return (
      <div className="ui secondary pointing menu">
        <a className="ui icon item" onClick={() => this.doNavAction("home")}>
          <i className="sidebar icon"></i>
        </a>
        <div className="header item">
          {this.props.header}
        </div>
        <div className="right menu">
          <a className="icon item" onClick={() => this.doNavAction("minimize")}>
            <i className="minus icon"></i>
          </a>
          <a className="icon item" onClick={() => this.doNavAction("settings")}>
            <i className="setting icon"></i>
          </a>
          <a className="icon item" onClick={() => this.doNavAction("close")}>
            <i className="close icon" ></i>
          </a>
        </div>
      </div>
    );
  }
});
