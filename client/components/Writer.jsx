import React from 'react';

const Writer = React.createClass({

  handleSubmit(event) {
    if(event.keyCode === 13) {
      var input = document.getElementById("message")
      var text = input.value;
      input.value = "";
      this.props.pushMessage(text);
    }
  },

  render() {

    return (
      <div className="ui form writer">
        <div className="field">
          <textarea id="message" name="message" rows="2" placeholder="Message.." onKeyDown={this.handleSubmit}>
          </textarea>
        </div>
      </div>
    );
  }
});

export default Writer;


