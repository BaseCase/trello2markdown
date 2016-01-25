function Trello2Markdown () {}

//
// DOM interaction layer - no unit tests here, just UI testing
//
Trello2Markdown.prototype.start = function() {
  var json_input_el = document.getElementById("json-input");
  json_input_el.addEventListener('input', this.handle_json_input_change.bind(this));
};

Trello2Markdown.prototype.handle_json_input_change = function(event) {
  var json_text = event.target.value;
  var markdowned = this.convert_json_to_markdown(json_text);
  var markdown_output_el = document.getElementById("markdown-output");
  markdown_output_el.innerHTML = markdowned;
};


//
// core logic - unit tests should exist for these methods
//
Trello2Markdown.prototype.convert_json_to_markdown = function(json_text) {
  return "<h2>oh hi there</h2><p>" + json_text + "</p>";
};



if (typeof module !== "undefined") module.exports = Trello2Markdown;
else window.Trello2Markdown = Trello2Markdown;
