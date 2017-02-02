# VirtualDog
An easy to grasp example for training on various web technologies

```
npm install
npm start
```

Uses **npm scripts to run locally installed packages** without the need to run from command line, so **everything is local to avoid versioning issues** with a plethora of globally installed versions on student’s ‘puters. 
Since you want to use the local version of stuff (e.g. typescript, typings, etc), you **don’t want to run command line directly (contrary to the course instructions)** since that will either:
- Fail if you don’t have the node module installed globally, 
- Or if you do have it installed globally, it will run the global version which may be different than the local version used in this project.

Instead do this:
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

Note: Since you quickly run out of hits on the Mars Rover API site using the 
demo key, I added a private key (app/core/storePrivateKey.ts) file to let you 
store your private key in local storage which gives you tons of 
downloads/hour/day unlike demo key which is limited to 50/hour - 100/day. Get 
a key from NASA, like I did and throw it in the file. Just make sure not to 
check that file into GitHub ever since the key is super secret. Once your key 
is stored you can delete the storePrivateKey file, the key does not expire in 
local storage.