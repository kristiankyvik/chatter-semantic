import React from 'react';
import ReactDOM from 'react-dom';


const Writer = React.createClass({

  handleSubmit(event) {
    const input = document.getElementById("message");
    if(event.keyCode === 13) {
      const text = input.value;
      input.value = "";
      $("#message").val('');
      this.props.pushMessage(text);
    }
    while($(input).outerHeight() < input.scrollHeight + parseFloat($(input).css("borderTopWidth")) + parseFloat($(input).css("borderBottomWidth"))) {
        $(input).height($(input).height()+1);
    };

  },

  componentDidMount(){
    ReactDOM.findDOMNode(this.refs.writer).focus();
  },

  render() {

    return (
      <div className="ui form writer">
        <div className="field">
          <textarea id="message" rows="1" name="message" ref="writer" placeholder="Message.." onKeyDown={this.handleSubmit}>
          </textarea>
        </div>
      </div>
    );
  }
});

export default Writer;


