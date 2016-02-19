var td = require('testdouble');
var chai = require('chai');
var tdChai = require('testdouble-chai');
chai.use(tdChai(td));
var expect = chai.expect;
var when = td.when;
var T2M = require('../javascript/t2m.js');


describe('MarkdownGenerator', function() {
  beforeEach(function() {
    this.subject = new T2M.MarkdownGenerator();
  });

  describe('.generate()', function() {
    it("returns the title as a first-level heading", function() {
      expect(this.subject.generate({ title: "hi" })).to.equal("# hi\n");
    });

    it("leaves it out if there's no title", function() {
      expect(this.subject.generate({})).to.equal("");
    });

    it("returns chapters as second-level headings", function() {
      expect(this.subject.generate({ chapters: [{ title: "first chap" }, { title: "second chap" }] }))
        .to.equal("## first chap\n## second chap\n");
    });

    it("returns sections as third-level headings", function() {
      expect(this.subject.generate({ chapters: [{ title: "hi", sections: [{ title: "section", content: "cool" }] }] }))
        .to.equal("## hi\n### section\ncool\n");
    });
  });
});
