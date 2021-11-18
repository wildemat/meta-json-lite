# meta-json-lite
Liteweight repo to explore data from a json object

I get a complex json object and want to extract conclusions from it. But I have to write a script to load a file, parse objects, print to console for debugging, etc.
I want a UI to load in JSON text, convert it to usable objects and datatypes that I can query and view.

Note: Read-only

1. Paste in JSON and validate
2. parse the json and create UI components to represent the different datatypes. (explode nested objects into new tabs as root objects)
3. allow updating of datatypes and naming key-value pairs as certain objects (ex. { myusername: {<userdata>}} could be a User object with name 'myusername')
4. apply brebuilt functions and commands to analyze data (hover over array, click forEach button which creates a block-style code panel off to the right where I can reference other json tabs as variables, access variables which i have defined from other json objects)
5. view panel of all existing variables and their source.
6. Use variables to build custom output for export (.json, .csv, etc)
  
  So i can give my data to a tpm and let them play with it.
