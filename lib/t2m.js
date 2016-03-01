var T2M = T2M || {};


//
// UI shell stuff. Only for use on the Trello2Markdown website, not when running in Node.
//

T2M.set_up_ui = function() {
  var converter,
      markdown_output_el = document.getElementById("markdown-output"),
      json_input_el = document.getElementById("json-input"),
      url_load_btn = document.getElementById("btn-url-input"),
      url_input_el = document.getElementById("url-input"),
      local_error_el = document.getElementById("local-error"),
      network_error_el = document.getElementById("network-error"),
      include_board_title_el = document.getElementById("include-board-title"),
      include_list_titles_el = document.getElementById("include-list-titles"),
      config = new T2M.DocumentConfig();

  json_input_el.addEventListener('input', handle_json_input_change);
  url_load_btn.addEventListener('click', handle_load_url);
  include_board_title_el.addEventListener('change', handle_include_board_title_change);
  include_list_titles_el.addEventListener('change', handle_include_list_titles_change);

  function rerender() {
    markdown_output_el.value = converter.convert();
  }

  function handle_json_input_change(event) {
    try {
      local_error_el.classList.add("hidden");
      var parsed_json = JSON.parse(json_input_el.value);
      converter = new T2M.ConvertsTrelloToMarkdown(parsed_json, config);
      rerender();
    } catch(e) {
      local_error_el.classList.remove("hidden");
    }
  }

  function handle_load_url() {
    network_error_el.classList.add("hidden");
    var url = make_json_url(url_input_el.value);
    var req = new XMLHttpRequest();
    req.addEventListener('load', function(res) {
      json_input_el.value = res.target.response;
      handle_json_input_change();
    })
    req.addEventListener('error', function() {
      network_error_el.classList.remove("hidden");
    });
    req.open("GET", url)
    req.send();
  }

  function make_json_url(url) {
    var json_re = /.*\.json$/;
    if (json_re.test(url)) return url;
    return url + ".json";
  }

  function handle_include_board_title_change(e) {
    config.include_board_title = e.target.checked;
    rerender();
  }

  function handle_include_list_titles_change(e) {
    config.include_list_titles = e.target.checked;
    rerender();
  }
};


//
// core logic; not dependent on browser
//

T2M.ConvertsTrelloToMarkdown = function(json_data, document_config) {
  this.json_data = json_data || {};
  this.document_config = document_config || new T2M.DocumentConfig();
};

  T2M.ConvertsTrelloToMarkdown.prototype.convert = function() {
    // cache the extracted data so it's faster to reuse if document layout settings change
    this.document_data = this.document_data || new T2M.ExtractsUsefulData(this.json_data).extract();
    return new T2M.GeneratesMarkdown(this.document_config).generate(this.document_data);
  };


T2M.ExtractsUsefulData = function(json_data) {
  this.json_data = json_data || {};
};

  T2M.ExtractsUsefulData.prototype.extract = function() {
    try {
      return {
        title: this.json_data.name,
        chapters: this.chapters()
      };
    } catch (e) {
      throw new T2M.BadTrelloDataError();
    }
  };

  T2M.ExtractsUsefulData.prototype.chapters = function() {
    return this.json_data.lists.filter(function(list) {
      return !list.closed;
    }).map(function(list) {
      return {
        title: list.name,
        sections: this.sections_for_chapter(list.id)
      };
    }.bind(this));
  };

  T2M.ExtractsUsefulData.prototype.sections_for_chapter = function(chapter_id) {
    return this.json_data.cards.filter(function(card) {
      return card.idList === chapter_id && !card.closed;
    }).map(function(card) {
      return {
        title: card.name,
        content: card.desc
      };
    });
  };

T2M.BadTrelloDataError = function(message) {
  this.name = "BadTrelloDataError";
  this.message = message || "Could not extract needed info from given Trello data.";
  this.stack = (new Error()).stack;
};
T2M.BadTrelloDataError.prototype = Object.create(Error.prototype);
T2M.BadTrelloDataError.prototype.constructor = T2M.BadTrelloDataError;


T2M.GeneratesMarkdown = function(document_config) {
  this.document_config = document_config || new T2M.DocumentConfig();
};

  T2M.GeneratesMarkdown.prototype.generate = function(document_data) {
    this.document_data = document_data;
    return this.title() + this.chapters();
  };

  T2M.GeneratesMarkdown.prototype.title = function() {
    if (this.document_config.include_board_title)
      return this.document_data.title ?
                  "# " + this.document_data.title + "\n"
                : "";
    else
      return "";
  };

  T2M.GeneratesMarkdown.prototype.chapters = function() {
    var chapters = this.document_data.chapters;
    return chapters ?
              chapters.map(function(chapter) {
                return this.chapter_title(chapter) + this.sections(chapter)
              }.bind(this)).join('')
            : "";
  };

  T2M.GeneratesMarkdown.prototype.chapter_title = function(chapter) {
    return this.document_config.include_list_titles ? "## " + chapter.title + "\n" : "";
  };

  T2M.GeneratesMarkdown.prototype.sections = function(chapter) {
    if (!chapter.sections) return "";
    return chapter.sections.map(function(section) {
      return (section.title? "### " + section.title + "\n" : "")
             + section.content + "\n\n";
    }).join("");
  };


T2M.DocumentConfig = function() {
  this.include_board_title = true;
  this.include_list_titles = true;
}



if (typeof module !== "undefined") module.exports = T2M;
else window.T2M = T2M;
