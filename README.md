# Gremlin-Visualizer
This project is to visualize the graph network corresponding to a gremlin query.

![alt text](https://raw.githubusercontent.com/prabushitha/Readme-Materials/master/Gremlin-Visualizer.png)

### Setting Up Gremlin Visualizer
To setup gremlin visualizer, you need to have `node.js` and `npm` installed in your system.

* Clone the project
```sh
git clone https://github.com/prabushitha/gremlin-visualizer.git
```
* Install dependencies
```sh
npm install
```
* Run the project
```sh
npm start
```
* Open the browser and navigate to
```sh
http://localhost:3000
```

Note - Frontend starts on port 3000 and simple Node.js server also starts on port 3001. If you need to change the ports, configure in `package.json`, `proxy-server.js`, `src/constants` 

### Usage
* Start Gremlin-Visualizer as mentioned above
* Start or tunnel a gremlin server
* Specify the host and port of the gremlin server
* Write an gremlin query to retrieve a set of nodes (eg. `g.V()`)

### Features
* If you don't clear the graph and execute another gremlin query, results of previous query and new query will be merged and be shown.
* Node and edge properties are shown once you click on a node/edge
* Change the labels of nodes to any property
* View the set of queries executed to generate the graph
* Traverse in/out from the selected node

### 
## Contributors
* Umesh Jayasinghe (Github: prabushitha)

## Something Missing?

If you have new ideas to improve please create a issue and make a pull request
