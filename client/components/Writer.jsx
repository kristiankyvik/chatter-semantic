import React from 'react';
import ReactDOM from 'react-dom';


const Writer = React.createClass({

  handleSubmit(event) {
    if(event.keyCode === 13) {
      var input = document.getElementById("message")
      var text = input.value;
      input.value = "";
      this.props.pushMessage(text);
    }
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


