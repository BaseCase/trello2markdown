var T2M = T2M || {};


//
// UI shell stuff. Only for use on the Trello2Markdown website, not when running in Node.
//

// TODO(cjb): restore the error handling stuff, which used to exist in the cowboyed code

T2M.set_up_ui = function() {
  var converter,
      markdown_output_el = document.getElementById("markdown-output"),
      json_input_el = document.getElementById("json-input"),
      url_load_btn = document.getElementById("btn-url-input"),
      url_input_el = document.getElementById("url-input");

  json_input_el.addEventListener('input', handle_json_input_change);
  url_load_btn.addEventListener('click', handle_load_url);

  function handle_json_input_change(event) {
    var parsed_json = JSON.parse(json_input_el.value);
    converter = new T2M.ConvertsTrelloToMarkdown(parsed_json);
    markdown_output_el.innerHTML = converter.convert();
  }

  function handle_load_url() {
    var url = make_json_url(url_input_el.value);
    var req = new XMLHttpRequest();
    req.addEventListener('load', function(res) {
      json_input_el.innerHTML = res.target.response;
      handle_json_input_change();
    })
    req.open("GET", url)
    req.send();
  }

  function make_json_url(url) {
    var json_re = /.*\.json$/;
    if (json_re.test(url)) return url;
    return url + ".json";
  }
};


//
// core logic; not dependent on browser
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


T2M.MarkdownGenerator = function() { };

  T2M.MarkdownGenerator.prototype.generate = function(document_data) {
    this.document_data = document_data;
    return this.title() + this.chapters();
  };

  T2M.MarkdownGenerator.prototype.title = function() {
    return this.document_data.title ?
                "# " + this.document_data.title + "\n"
              : "";
  };

  T2M.MarkdownGenerator.prototype.chapters = function() {
    var chapters = this.document_data.chapters;
    return chapters ?
              chapters.map(function(chapter) {
                return "## " + chapter.title + "\n" + this.sections(chapter)
              }.bind(this)).join('')
            : "";
  };

  T2M.MarkdownGenerator.prototype.sections = function(chapter) {
    if (!chapter.sections) return "";
    return chapter.sections.map(function(section) {
      return (section.title? "### " + section.title + "\n" : "")
             + section.content + "\n\n";
    }).join("");
  };


if (typeof module !== "undefined") module.exports = T2M;
else window.T2M = T2M;
