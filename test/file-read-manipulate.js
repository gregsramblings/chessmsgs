const express = require('express')
const app = express()
const port = 3000

var fs = require('fs')
var indexFile = fs.readFileSync('index.html', 'utf8');

app.get('/', (req, res) => {
    res.send('Hello World!' + indexFile)
})

app.get('/greg', (req, res) => {
    var fenInjected = indexFile.replace("Boom",req.url);
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.send(fenInjected);
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



