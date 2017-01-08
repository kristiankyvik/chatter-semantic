import React from 'react';
import ReactDOM from 'react-dom';


const Writer = React.createClass({

  handleSubmit (event) {
    const input = document.getElementById("message");
    $(input).on('focus', function () {
      this.value = '';
    });

    const enterPressed = event.keyCode === 13;
    const btnPressed = event === "btn-pressed";
    const hasSubmitted = enterPressed || btnPressed;

    if (hasSubmitted) {
      enterPressed ? event.preventDefault() : false;
      const text = input.value;
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
    return (
      <div className="ui form writer">
        <div className="field">
          <textarea id="message" rows="1" name="message" ref="writer" placeholder="Message.." onKeyDown={this.handleSubmit}>
          </textarea>
          <div className="send-btn" onClick={()=> this.handleSubmit("btn-pressed")}>
            Send
          </div>
        </div>
      </div>
    );
  }
});

export default Writer;


