Nav = React.createClass({

  doNavAction(action) {
    this.props.doNavAction(action);
  },

  render() {
    const iconSettings = {
      roomList: {
        icon: "",
        nextView: "home"
      },
      room: {
        icon: "chevron left icon",
        nextView: "home"
      },
      settings: {
        icon: "close icon",
        nextView: "room"
      },
      newRoom: {
        icon: "chevron left icon",
        nextView: "home"
      }
    };

    const iconHTML = (
      <a className="icon item" onClick={() => this.doNavAction(iconSettings[this.props.view].nextView)}>
        <i className={iconSettings[this.props.view].icon}></i>
      </a>
    );

    return (
      <div className="ui secondary pointing menu">
        {iconHTML}
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
