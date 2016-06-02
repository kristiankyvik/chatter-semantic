import React from 'react';
import ReactDOM from 'react-dom';


const Writer = React.createClass({

  handleSubmit(event) {
    const input = document.getElementById("message");
    $(input).on('focus', function() {
         this.value = '';
     });

    if(event.keyCode === 13) {
      event.preventDefault();
      const text = input.value;
      this.props.pushMessage(text);
      input.value = "";
      $(input).attr("rows", "1").css("height",41);
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


