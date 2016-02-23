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
* I'm choosing not to use something like `browserify` here so that it's easy to
host this on Github Pages. The result is that there are more responsibilities in
`t2m.js` than I'd normally put in one file, but that's on purpose.
