var T2M = T2M || {};


//
// For use when this is running on the Trello2Markdown webpage.
// Don't call this function from node.
// (It's all in the same file because I want this to be super easy to run
//  as a GitHub page)
//
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

T2M.ConvertsTrelloToMarkdown = function() {};

T2M.ConvertsTrelloToMarkdown.prototype.convert = function(json_text) {
  var parsed_data = {
    'title': '',
    'lists': []
  };

  var error_el = document.getElementById("json-error");
  try {
    parsed_data = this.extract_useful_data(JSON.parse(json_text));
    error_el.classList.add("hidden");
  } catch (e) {
    error_el.classList.remove("hidden");
  }

  var markdownified = this.generate_markdown(parsed_data);
  return markdownified;
};

T2M.ConvertsTrelloToMarkdown.prototype.generate_markdown = function(data) {
  return this.title(data) + "\n" +
         this.all_sections(data);
};


//
// data extraction stuff
//
T2M.ConvertsTrelloToMarkdown.prototype.extract_useful_data = function(parsed_data) {
  var title = parsed_data.name;
  var lists = this.extract_list_data(parsed_data);
  return {
    'title': title,
    'lists': lists
  };
};

T2M.ConvertsTrelloToMarkdown.prototype.extract_list_data = function(parsed_data) {
  var visible_lists = parsed_data.lists.filter(function(list) {
    return !list.closed;
  });
  var lists_with_cards = visible_lists.map(function(list) {
    return this.list_with_card_data(list, parsed_data);
  }.bind(this));
  return lists_with_cards;
};

T2M.ConvertsTrelloToMarkdown.prototype.list_with_card_data = function(list, parsed_data) {
  var cards_in_this_list = parsed_data.cards.filter(function(card) {
    return (card.idList === list.id)
           && !card.closed;
  });
  return {
    'name': list.name,
    'cards': cards_in_this_list.map(function(card) {
      return {
        'heading': card.name,
        'body': card.desc
      }
    })
  };
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



if (typeof module !== "undefined") module.exports = T2M;
else window.T2M = T2M;
