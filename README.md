# chessmsgs

## Local testing
* docker build -t greg1 .
* docker run --publish 8000:8080 --detach greg1

## Deploying to Cloud Run
* gcloud builds submit --tag gcr.io/chessmsgs/chessmsgs
* gcloud run deploy --image gcr.io/chessmsgs/chessmsgs --platform managed

