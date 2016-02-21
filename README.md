# Trello2Markdown
Trello2Markdown is a little chunk of code that converts a
[Trello](http://trello.com) board into a
[Markdown](https://daringfireball.net/projects/markdown/) document. It converts
the board's title, list names, and card names into nested headings, and it
turns card description text into paragraphs. For public boards, it can just
take a URL and grab the data itself. For private boards, you can use Trello's
export feature and give the resulting JSON to Trello2Markdown.

## Web version
There's a [web app version](http://caseybrant.com/trello2markdown) available,
which is the easiest way to do it.

[Here is a short screencast](https://www.youtube.com/watch?v=WP_pQNYzf8Y)
demoing the web app.


## Command line version
*(Coming soon!)*

You can also install it as a command line NodeJS program, which enables you to
do stuff like pipe the output somewhere. (not yet, but soon)


## Installation instructions
*to be written once the command line version works*


## Developer notes
I'm intentionally avoiding JS build tools because the website version of
Trello2Markdown has no backend and is just hosted right on Github Pages. The
`t2m.js` file has a bit more stuff in it than it logically ought to, for the
same reason.


## Vesitigial TODO list
### for v1
- [ ] instructions for how to get the export from private boards
- [x] update README so it makes sense
- [x] ensure card and list orders are maintained
- [x] license file
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
- [ ] browser bookmarklet for putting the board export in your clipboard?
- [ ] get domain for this and set it up so it points to hosted-on-github page
- [ ] make the JS version runnable as a standalone on Node/installable on npm?
- [ ] save and load things in localStorage so that it's still there if you navigate away
- [x] actual unit test suite instead of a fake one, lol


## Dev notes
* I'm choosing not to use `browserify` here so that it's easy to host this on Github.
