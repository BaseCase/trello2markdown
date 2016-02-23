var expect = require('chai').expect;
var T2M = require('../lib/t2m.js');


describe('GeneratesMarkdown', function() {
  beforeEach(function() {
    this.subject = new T2M.GeneratesMarkdown();
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
      expect(this.subject.generate({ chapters: [{ title: "hi", sections: [
        { title: "section1", content: "cool" },
        { title: "section2", content: "neat" }
      ] }] }))
        .to.equal("## hi\n### section1\ncool\n\n### section2\nneat\n\n");
    });
  });
});
