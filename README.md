# trello2markdown
Converts a JSON export from Trello to a Markdown file. WIP.
<a href="http://caseybrant.com/trello2markdown">Live version here.</a>

## TODO
### for v1
- [ ] instructions for how to get the export from private boards
- [ ] ensure card and list orders are maintained
- [ ] license file
- [ ] update README so it makes sense
- [x] error handling on URL import
- [x] restore the parsing error handling stuff, which used to exist in the cowboyed code
- [x] live update the output pane upon changes to the input box
- [x] basic layout of HTML/JS version
- [x] error message if JSON is unparseable for some reason
- [x] one-click import from public Trello boards (should be easy-ish since all you have to do is edit the URL)
- [x] google analytics tracker
- [x] HOWTO video

### later
- [ ] adjustable output (you can decide how many spaces after a header, for example)
- [ ] more robust input sanitization
- [ ] button for copy markdown to clipboard
- [ ] actual unit test suite instead of a fake one, lol
- [ ] browser bookmarklet for putting the board export in your clipboard?
- [ ] get domain for this
- [ ] set up domain so it points to hosted-on-github page
- [ ] update Python version to feature-parity with the JS version?
- [ ] make the JS version runnable as a standalone on Node/installable on npm?
- [ ] save and load things in localStorage so that it's still there if you navigate away


## Dev notes
* I'm choosing not to use `browserify` here so that it's easy to host this on Github.
