var td = require('testdouble');
var chai = require('chai');
var tdChai = require('testdouble-chai');
chai.use(tdChai(td));
var expect = chai.expect;
var when = td.when;
var T2M = require('../javascript/t2m.js');


describe('MarkdownGenerator', function() {
  beforeEach(function() {
    this.generator = new T2M.MarkdownGenerator();
  });

  it("needs to be written", function() {
  });
});
