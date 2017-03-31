import React from 'react';
import ReactDOM from 'react-dom';


const Writer = React.createClass({
  getInitialState: function () {
    return {
      msg_valid: false
    };
  },

  handleSubmit (event) {
    const enterPressed = event.keyCode === 13;
    enterPressed ? event.preventDefault() : false;

    const input = document.getElementById("message");
    const text = input.value.trim();
    let valid = false;
    if (text.length < 1000 && text.length > 0) {
      this.setState({msg_valid: true});
      valid = true;
    } else if (this.state.msg_valid) {
      valid = false;
      this.setState({msg_valid: false});
    }

    const btnPressed = event === "btn-pressed";
    const hasSubmitted = enterPressed || btnPressed;

    if (hasSubmitted && valid) {
      this.props.pushMessage(text);
      input.value = "";
      $(input).attr("rows", "1").css("height", 41);
      btnPressed ? ReactDOM.findDOMNode(this.refs.writer).focus() : false;
    }

    if ($(input).outerHeight() >= 250) {
      return;
    }

    while($(input).outerHeight() < input.scrollHeight + parseFloat($(input).css("borderTopWidth")) + parseFloat($(input).css("borderBottomWidth"))) {
      $(input).height($(input).height() + 1);

      if ($(input).outerHeight() >= 250) {
        return;
      }
    }
  },

  componentDidMount () {
    ReactDOM.findDOMNode(this.refs.writer).focus();
  },

  render () {
    const btn_disabled = this.state.msg_valid ? "" : "disabled";
    return (
      <div className="ui form writer">
        <div className="field">
          <textarea id="message" rows="1" name="message" ref="writer" placeholder="Message.." onKeyDown={this.handleSubmit} onKeyUp={this.handleSubmit}>
          </textarea>
          <button className={"ui button send-btn" + " " + btn_disabled} ref="send_btn" onClick={()=> this.handleSubmit("btn-pressed")}>
            Send
          </button>
        </div>
      </div>
    );
  }
});

export default Writer;


