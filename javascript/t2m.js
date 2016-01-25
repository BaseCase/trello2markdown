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
  markdown_output_el.innerHTML = "<pre>" + markdowned + "</pre>";
};


//
// core logic - unit tests should exist for these methods
//
Trello2Markdown.prototype.convert_json_to_markdown = function(json_text) {
  var parsed_data = {
    'title': '',
    'lists': []
  };

  try {
    parsed_data = this.extract_useful_data(JSON.parse(json_text));
  } catch (e) {
    console.log("couldn't parse it :/");
  }

  var markdownified = this.generate_markdown(parsed_data);
  return markdownified;
};

Trello2Markdown.prototype.generate_markdown = function(data) {
  return this.title(data) + "\n" +
         this.all_sections(data);
};


//
// data extraction stuff
//
Trello2Markdown.prototype.extract_useful_data = function(parsed_data) {
  var title = parsed_data.name;
  var lists = this.extract_list_data(parsed_data);
  return {
    'title': title,
    'lists': lists
  };
};

Trello2Markdown.prototype.extract_list_data = function(parsed_data) {
  var visible_lists = parsed_data.lists.filter(function(list) {
    return !list.closed;
  });
  var lists_with_cards = visible_lists.map(function(list) {
    return this.list_with_card_data(list, parsed_data);
  }.bind(this));
  return lists_with_cards;
};

Trello2Markdown.prototype.list_with_card_data = function(list, parsed_data) {
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
Trello2Markdown.prototype.title = function(data) {
  return "# " + data.title;
};


Trello2Markdown.prototype.all_sections = function(data) {
  return data.lists.map(function(list) {
    return this.section(list);
  }.bind(this)).join('\n');
};


Trello2Markdown.prototype.section = function(list_data) {
  return "## " + list_data.name + "\n" +
    list_data.cards.map(function(card) {
      return this.subsection(card);
    }.bind(this)).join('\n') + "\n";
};


Trello2Markdown.prototype.subsection = function(card_data) {
  return "### " + card_data.heading + "\n" + card_data.body + "\n";
};



if (typeof module !== "undefined") module.exports = Trello2Markdown;
else window.Trello2Markdown = Trello2Markdown;
