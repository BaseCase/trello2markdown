# trello2markdown
Converts a JSON export from Trello to a Markdown file. WIP.

## TODO
- [ ] basic layout of HTML/JS version
- [ ] adjustable output (you can decide how many spaces after a header, for example)
- [ ] live update the output pane upon changes to the input box
- [ ] error message if JSON is unparseable for some reason
- [ ] one-click import from public Trello boards
- [ ] instructions for how to get the export from private boards
- [ ] browser bookmarklet for putting the board export in your clipboard?
- [ ] get domain for this
- [ ] set up domain so it points to hosted-on-github page
- [ ] update Python version to feature-parity with the JS version?
- [ ] make the JS version runnable as a standalone on Node/installable on npm?
- [ ] license file
- [ ] save and load things in localStorage so that it's still there if you navigate away
- [ ] no spellcheck on input box

## Dev notes
* I'm choosing not to use `browserify` here so that it's easy to host this on Github.
