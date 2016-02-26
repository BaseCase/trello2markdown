var expect = require('chai').expect;
var T2M = require('../lib/t2m.js');


describe('ExtractsUsefulData', function() {
  describe('with good data', function() {
    beforeEach(function() {
      var sampleJSON = {
        name: 'Board Name',
        lists: [
        {
          id: 1,
          closed: false,
          name: 'A List'
        }, {
          id: 2,
          closed: true,
          name: 'A Closed List That Should Not Appear'
        }
        ],
        cards: [
        {
          idList: 1,
          closed: false,
          name: 'Cool Card Name',
          desc: "The text of that card"
        }, {
          idList: 1,
          closed: true,
          name: 'Archived Card',
          desc: "no"
        }
        ]
      };
      var extractor = new T2M.ExtractsUsefulData(sampleJSON);
      this.extracted_data = extractor.extract();
    });

    it("gets the title of the document", function() {
      expect(this.extracted_data.title).to.equal('Board Name');
    });

    it("converts unarchived lists to chapters", function() {
      expect(this.extracted_data.chapters.length).to.equal(1);
      expect(this.extracted_data.chapters[0].title).to.equal('A List');
    });

    it("converts unarchived cards to sections, which it nests inside containing chapters", function() {
      expect(this.extracted_data.chapters[0].sections.length).to.equal(1);
      var section = this.extracted_data.chapters[0].sections[0];
      expect(section.title).to.equal('Cool Card Name');
      expect(section.content).to.equal("The text of that card");
    });
  });

  describe('with bad data', function() {
    it("throws BadTrelloDataError in the case of bad Trello data", function() {
      expect(function() {
        new T2M.ExtractsUsefulData({}).extract();
      }).to.throw(T2M.BadTrelloDataError);
    });
  });
});
