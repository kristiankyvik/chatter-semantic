Nav = React.createClass({

  doNavAction(action) {
    this.props.doNavAction(action);
  },

  render() {
    const topRight = {
      roomList: null,
      room: (
        <a className="ui icon item" onClick={() => this.doNavAction("home")}>
          <i className="chevron left icon"></i>
        </a>
      ),
      settings:
        (
          <a className="icon item" onClick={() => this.doNavAction("room")}>
            <i className="close icon" ></i>
          </a>
        )
    };

    return (
      <div className="ui secondary pointing menu">
        {topRight[this.props.view]}
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
        </div>
      </div>
    );
  }
});
