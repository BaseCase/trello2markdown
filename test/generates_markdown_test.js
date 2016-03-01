var expect = require('chai').expect;
var T2M = require('../lib/t2m.js');


describe('GeneratesMarkdown', function() {
  describe('.generate()', function() {
    beforeEach(function() {
      this.subject = new T2M.GeneratesMarkdown();
    });

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

  describe("with config", function() {
    it("includes the board title if config says so", function() {
      var config = { include_board_title: true };
      var subject = new T2M.GeneratesMarkdown(config);
      expect(subject.generate({ title: "hi" })).to.equal("# hi\n");
    });

    it("leaves out the board title if config says so", function() {
      var config = { include_board_title: false };
      var subject = new T2M.GeneratesMarkdown(config);
      expect(subject.generate({ title: "hi" })).to.equal("");
    });

    it("includes the list titles if config says so", function() {
      var config = { include_list_titles: true };
      var subject = new T2M.GeneratesMarkdown(config);
      expect(subject.generate({ chapters: [{ title: "first chap" }, { title: "second chap" }] }))
        .to.equal("## first chap\n## second chap\n");
    });

    it("leaves out the list titles if config says so", function() {
      var config = { include_list_titles: false };
      var subject = new T2M.GeneratesMarkdown(config);
      expect(subject.generate({ chapters: [{ title: "first chap" }, { title: "second chap" }] }))
        .to.equal("");
    });
  });
});
