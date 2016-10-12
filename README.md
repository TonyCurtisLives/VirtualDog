# VirtualDog
## An easy to grasp example for training on various web technologies

### Use the **feature/begin** and **feature/end** branches to follow along with the [Pluralsight course here](https://www.pluralsight.com/courses/javascript-jasmine-typescript) 

To get started go to your fork directory in a command prompt and do this:

```
npm install
npm start
```

Uses **npm scripts to run locally installed packages** without the need to run from command line, so **everything is local to avoid versioning issues** with a plethora of globally installed versions on student’s ‘puters. 
Since you want to use the local version of stuff (e.g. typescript, typings, etc), you **don’t want to run command line directly (contrary to the course instructions)** since that will either:
- Fail if you don’t have the node module installed globally, 
- Or if you do have it installed globally, it will run the global version which may be different than the local version used in this project.

Instead do this (as needed):
```
npm run tsc 
npm run tsc -- -w
npm run typings -- install dt~silly-node-module --global --save
```

The pertinent part being `npm run` and if you want to add command line parameters follow the module name with the double dash (`--`) then add your command line parameters.
Right now only bower, tsc, and typings have scripts in the package.json file that will allow this, so if there are other command-line-ish things you want to add to package.json, then add them to the list of scripts
 
Requires the following global installations:

- npm

Also globally installed:

- tslint (used by VSCode) 

### To bring up the Virtual Dog Blog in the browser simply navigate to localhost:8042

### To bring up the Jasmine tests in the browser simply navigate to the test/SpecRunner.html file in your browser

No frills, super simple, just a dog and his blog.