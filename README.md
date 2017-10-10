# comp5338-polygot-persistence-systems
### To check this repo
```
git clone https://github.com/MingxuanLi/comp5338-polygot-persistence-systems.git
```

### first you need to install node.js 7.8.x above and npm 5.0 above here
This project is running on top node.js so this step is mandatory cannot be skipped
```
https://nodejs.org/en/download/current/
https://docs.npmjs.com/getting-started/installing-node
```

### To install all the required dependencies
```
npm install
```

### To load the data into mongodb or neo4j
```
npm run generate
npm run load -- --db={mongodb|neo4j}
```

### To run the query 
```
npm run query -- --db={mongodb|neo4j} --query={sq1|sq2|aq1|aq2|aq3|aq4|aq5_1|aq5_2|aq6}
```
