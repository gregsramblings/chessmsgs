# chessmsgs - Play Chess over social and messaging apps

Created because I wanted to play chess with others without having to install software, create accounts, etc.. Game play is simple -- make your move, copy and paste the URL to your opponent, etc.

## Technical details:

**Web browser-side** - all chess logic is run in the browser

* [chessboard.js](https://github.com/oakmac/chessboardjs/) - JavaScript chessboard component - by [Chris Oakman](https://twitter.com/oakmac1)
* [chess.js](https://github.com/jhlywa/chess.js) - JavaScript chess library that is used for chess move generation/validation, piece placement/movement, and check/checkmate/stalemate detection - by [Jeff Hlywa](https://twitter.com/jhlywa)
* [body-scroll-lock](https://github.com/willmcpo/body-scroll-lock) - JavaScript library that makes it easy to manage scrolling on mobile (I needed to freeze scrolling during moves and this library works across almost all browsers) - by [Will Po](https://github.com/willmcpo)
* [JQuery](https://jquery.com/) - the above two chess libraries required it, so I used it too.

**Web Server**  - simple Node/Express server with some super simple templating to create the Open Graph and Twitter Card image URLs, links, etc.  This could have easily been a static website other than this tiny requirement.

* [request_ip](https://www.npmjs.com/package/request-ip) - Used for logging IP address of each move to use for future scaling (create additional copies in regions, etc.)
* [nanoid](https://www.npmjs.com/package/nanoid) - Used to generate unique Game IDs
* No database/data store -- all game state info is passed back and forth between players in URL
* Deployed on [Google Cloud Run](https://cloud.google.com/run?utm_campaign=CDR_grw_series_chessapp_release_120320&utm_source=external&utm_medium=web)

**Image Server** - used to generate the image used for Open Graph and Twitter cards so that when a user posts a game link to most platforms, the platform will show the image with the current board position. I created an endpoint that looks like any other png file url ([example](https://chessmsgs.com/fenimg/rn1qkbnr/ppp1pppp/8/3p4/3P2b1/2N5/PPP1PPPP/R1BQKBNR%20w%20KQkq%20-%202%203.png)).

* [chess-image-generator](https://github.com/andyruwruw/chess-image-generator) - JavaScript library that creates a png from a [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) (standard chess board notation) - by [Andrew Young](https://andyruwruw.com/)
* Deployed as a route in the web server Node express app

## Testing and deploying

#### There are three projects in this repo:
* Main web server in project root
* Web content in ./public
* Image generator in ./image-generator

#### Local testing of server. Run from project root.
* Install packages with 'npm install', then run 'node server.js'
* Access http://localhost:8080

#### Local testing of server as a container using Docker. Run from project root:
* docker build -t gregcontainer .
* docker run --publish 8000:8080 --detach gregcontainer

#### Deploying to Google Cloud Run
* gcloud builds submit --tag gcr.io/chessmsgs/chessmsgs
* gcloud run deploy --image gcr.io/chessmsgs/chessmsgs --platform managed


