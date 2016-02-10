var td = require('testdouble');
var chai = require('chai');
var tdChai = require('testdouble-chai');
chai.use(tdChai(td));
var expect = chai.expect;
var when = td.when;
var T2M = require('../javascript/t2m.js');


describe('ExtractsUsefulData', function() {
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
