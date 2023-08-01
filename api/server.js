const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');
const auth = require('json-server-auth');
const middlewares = jsonServer.defaults()

const app = jsonServer.create();
const data = fs.readFileSync(path.resolve(__dirname, '../db.json'), 'utf8');

let dbFilePath;
if (process.env.VERCEL){
    dbFilePath = '/tmp/db.json';
} else {
    dbFilePath = path.resolve(__dirname, '../db.json');
}
console.log(path.resolve(__dirname, dbFilePath))

fs.writeFileSync(dbFilePath, data);

const router = jsonServer.router(dbFilePath);

const port = process.env.PORT || 8080;

const rules = auth.rewriter(JSON.parse(fs.readFileSync(path.join(__dirname, '../routes.json'))));

// /!\ Bind the router db to the app
app.db = router.db

// You must apply the auth middleware before the router
app.use(middlewares);
app.use(rules);
app.use(auth);
app.use(router);
app.listen(port, () => {
    console.log(`JSON Server is running in ${port}`);
});

