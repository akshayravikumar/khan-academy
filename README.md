# Khan Academy Interview: Codealyzer

I had a lot of fun working on this project! Available at http://codealyzer.me.

## Running The App

Run `npm install` and `npm start`.

## How To Use 

Students can browse through and navigate to different problems from the home page. Once on a problem page, they can read the problem statement and type a solution into the Ace code editor. When the code changes (and Ace doesn't report any errors), a GET request is sent to the backend, where the code is analyzed against the whitelist, blacklist, and structure for that problem. Feedback is given to the students (and they can choose to hide it if they wish).

## How it Works

### Problem structure

Right now, for the sake of time, information about problems is stored in a JSON and managed with a Node JSON database library. Problems are keyed by ID number.

Each problem contains a few fields:
* `title`: The title of the problem.
* `statement`: The problem statement.
* `whitelist`: The list of components in the whitelist. Each component contains a `type`, i.e. the AST type of the node, and `explanation`, a hint that should be given to students if their code does not contain that type.
* `blacklist`: The list of components in the blacklist. Contains the same things as `whitelist`.
* `structure`: a JSON containing the rough structure of the code. Consists of an array of nodes, each one containing a `type`, `explanation`, and `children`, a list of the nodes that must be contained inside that node.

### Validator

When source code is sent to the backend, the validator uses Acorn to retrieve the AST. First, validator check through the whitelist/blacklist, simply by asking Acorn to see whether a node of that type exists. Next, it uses a recursive algorithm to see if the AST matches the rough structure. See the code, with comments, in `validator.js`.

For testing, obviously I was more concerned about the structure matching than the whitelist/blacklist. I manually tried some inputs and it seemed to be fine -- I didn't have time to add formal test cases, but was convinced that it worked.

### Why Acorn?

After researching the two parsers, I decided to choose Acorn over Epsrima: because this application requires realtime feedback, performance is extremely important, and from both applications' websites it looks like Acorn is faster. While neither API has good documentation, Acorn had some really neat features in its `walk` module that made the structure-checking reasonably simple. From what I could tell, implementing the same features with Esprima would be much more tedious, and I preferred not to use any third-party libraries for this purpose. While I might trust Esprima a bit more (more Github stars, associated with jQuery), both are under very active development, and I don't foresee any problems with the short, simple solutions students might write.

## Further Work

This was done in around 7ish hours, and there's definitely room for improvement. Some major things:
* Use an actual backend, not a JSON
* Sanitize the problem requirements to make sure they're valid (i.e., the same thing is in the blacklist and whitelist, or the structure involves nesting types that can't be nested)
* A GUI to edit/add problems
* Add actual test cases.

