var T2M = T2M || {};


//
// For use when this is running on the Trello2Markdown webpage.
// Don't call this function from node.
// (It's all in the same file because I want this to be super easy to run
//  as a GitHub page)
//

// TODO(cjb): restore the error handling stuff, which used to exist in the cowboyed code

T2M.set_up_ui = function() {
  var converter = new T2M.ConvertsTrelloToMarkdown();

  function handle_json_input_change(event) {
    var json_text = document.getElementById("json-input").value;
    var markdowned = converter.convert(json_text);
    var markdown_output_el = document.getElementById("markdown-output");
    markdown_output_el.innerHTML = markdowned;
  }

  function handle_load_url() {
    var url_input_el = document.getElementById("url-input");
    var url = make_json_url(url_input_el.value);
    var req = new XMLHttpRequest();
    req.addEventListener('load', function(res) {
      var json_text = document.getElementById("json-input").value;
      var json_input_el = document.getElementById("json-input");
      json_input_el.innerHTML = res.target.response;
      handle_json_input_change();
    });
    req.open("GET", url);
    req.send();
  }

  function make_json_url(url) {
    var json_re = /.*\.json$/;
    if (json_re.test(url)) return url;
    return url + ".json";
  }

  var json_input_el = document.getElementById("json-input");
  json_input_el.addEventListener('input', handle_json_input_change);

  var url_load_btn = document.getElementById("btn-url-input");
  url_load_btn.addEventListener('click', handle_load_url);
};



//
// core logic - this stuff can be run from either node or the browser
//

T2M.ConvertsTrelloToMarkdown = function(json_data, useful_data_extractor, markdown_generator) {
  var json_data = json_data || {};
  this.useful_data_extractor = useful_data_extractor || new T2M.ExtractsUsefulData(json_data);
  this.markdown_generator = markdown_generator || new T2M.MarkdownGenerator();
};

T2M.ConvertsTrelloToMarkdown.prototype.convert = function() {
  this.document_data = this.document_data || this.useful_data_extractor.extract(this.json_data);
  return this.markdown_generator.generate(this.document_data);
};


T2M.ExtractsUsefulData = function(json_data) {
  this.json_data = json_data || {};
};

T2M.ExtractsUsefulData.prototype.extract = function() {
  return {
    title: this.json_data.name,
    chapters: this.chapters()
  };
};

T2M.ExtractsUsefulData.prototype.chapters = function() {
  var chapters = this.json_data.lists.filter(function(list) {
    return !list.closed;
  }).map(function(list) {
    return {
      title: list.name,
      sections: this.sections_for_chapter(list.id)
    };
  }.bind(this));
  return chapters;
};

T2M.ExtractsUsefulData.prototype.sections_for_chapter = function(chapter_id) {
  var sections = this.json_data.cards.filter(function(card) {
    return card.idList === chapter_id && !card.closed;
  }).map(function(card) {
    return {
      title: card.name,
      content: card.desc
    };
  });
  return sections;
};




























/******
  begin cowboyed code:

T2M.ConvertsTrelloToMarkdown.prototype.generate_markdown = function(data) {
  return this.title(data) + "\n" +
         this.all_sections(data);
};


//
// markdown rendering stuff
//
T2M.ConvertsTrelloToMarkdown.prototype.title = function(data) {
  return "# " + data.title;
};


T2M.ConvertsTrelloToMarkdown.prototype.all_sections = function(data) {
  return data.lists.map(function(list) {
    return this.section(list);
  }.bind(this)).join('\n');
};


T2M.ConvertsTrelloToMarkdown.prototype.section = function(list_data) {
  return "## " + list_data.name + "\n" +
    list_data.cards.map(function(card) {
      return this.subsection(card);
    }.bind(this)).join('\n') + "\n";
};


T2M.ConvertsTrelloToMarkdown.prototype.subsection = function(card_data) {
  return "### " + card_data.heading + "\n" + card_data.body + "\n";
};

end cowboy code
********/


if (typeof module !== "undefined") module.exports = T2M;
else window.T2M = T2M;
