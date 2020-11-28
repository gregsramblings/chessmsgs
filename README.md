# chessmsgs

## There are three projects in this repo:
* Main web server in project root
* Web content in ./public
* Image generator - ./image-generator

## Local testing of server. Run from project root.
* Install packages with 'npm install', then run 'node index.js'
* Access http://localhost:8080

## Local testing of server as a container using Docker. Run from project root:
* docker build -t gregcontainer .
* docker run --publish 8000:8080 --detach gregcontainer

## Deploying to Google Cloud Run
* gcloud builds submit --tag gcr.io/chessmsgs/chessmsgs
* gcloud run deploy --image gcr.io/chessmsgs/chessmsgs --platform managed
