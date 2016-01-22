var expect = require('chai').expect;
var t2m = require('../javascript/t2m.js');

describe('Trello2Markdown', function() {
  it("is a work in progress", function() {
    var t = new t2m();
    expect(t.hi()).to.equal("hi");
  });
});
