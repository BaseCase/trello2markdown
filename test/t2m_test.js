var expect = require('chai').expect;
var T2M = require('../lib/t2m.js');


describe('Trello2Markdown Integration', function() {
  beforeEach(function() {
    this.sampleJSON = {
      name: 'Board Name',
      lists: [
        {
          id: 1,
          closed: false,
          name: 'A List'
        }
      ],
      cards: [
        {
          idList: 1,
          closed: false,
          name: 'Cool Card Name',
          desc: "The text of that card"
        }
      ]
    };
  });

  it("takes in a JSON object exported from a Trello board and converts it to Markdown", function() {
    var converter = new T2M.ConvertsTrelloToMarkdown(this.sampleJSON);
    var expected_markdown = `# Board Name
## A List
### Cool Card Name
The text of that card

`;
    expect(converter.convert()).to.equal(expected_markdown);
  });
});


