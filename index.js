const express = require('express');
const app = express();

var fs = require('fs')
var indexFile = fs.readFileSync('public/index.html', 'utf8');


app.get('/', (req, res) => {
	console.log("Sending indexFile")
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.send(indexFile)
})

app.use(express.static('public'));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`chessmsgs: listening on port ${port}`);
});
