# wordsCounter
## Description
This repo is a web API with 2 endpoints:

1. A 'word counter' endpoint
    - Receives a text input and counts the number of appearances for each word in the input.
    - The endpoint is able to accept the input in 3 ways:
        - A simple string sent in the request.
        - A file path (the contents of the file will be used as input).
        - A URL (the data returned from the URL will be used as input).
    - The input may be very large (up to tens of gigabytes).
    - The results (the number of appearances of each word) is persisted, to be used by the ‘word statistics’ service.

2. A 'word statistics' endpoint
    - Receives a word and returns the number of times the word appeared so far (in all previous inputs)

## Init the web-api locally
- clone the repo from github
- ```npm install```
- ```npm start```
- [open the swagger](http://localhost:10010/docs/#/)

## Test the apis
- Call the word-counter api as many times as you wish:
    - example for text in body:
        - ```json
          {
            "source": "body",
            "text": "Hi! My name is (what?), my name is (who?), my name is Slim Shady",
            "filepath": "string",
            "url": "string"
          }
          ```
    - example for text in filepath:
        - Create a file. copy it's path to "filepath" 
        - ```json
          {
            "source": "filepath",
            "text": "string",
            "filepath": "/Users/idotulma/go/src/wordsCounter/ido1.txt",
            "url": "string"
          }
          ```
    - example for text in url:
        - Create a file. copy it's path to "filepath" 
        - ```json
          {
            "source": "url",
            "text": "string",
            "filepath": "string",
            "url": "https://www.w3.org/TR/PNG/iso_8859-1.txt"
          }
          ```

- Call the word-statistics api:
    - examples
        - word: "the"
            - result: 61
        - word: "my"
            - result: 3

- restart the server and call the word-statistics api (check the persistency).

## Assumptions
- Words are separated with a space. All other characters are ignored.
- Input text for the ‘word counter’
    - The text passed in the body of the api call does not exceed the limit of http POST (depending which browser it is).
    - The hard disk of the machine is big enough to contain the arriving text (for the url case). It is essential because the stream is sent into a file from which another stream reads and calculates. 
- There might be many api calls simultaneously from different tabs. Therefore, the persistence of the “wordsCounter” service should be managed with mutual exclusion (mutex).
- The update of the ‘word counter’ will take place only once for each text. It means, the result of 'word statistics' (for any word) won't change till the ‘word counter’ call ends.
- The RAM of the running machine is able to persist a dictionary containing all the words in english. Thanks to that, I don’t need to use an external DB. 
    - Assuming we are storing raw words, a quick search in Google reveals that there are roughly 200,000 words in English. Assuming average word length to be 5 characters and since each character is one byte, memory required is approx 100,0000 bytes or 1 MB.
  Even if we assume 10,000,000 words (including names), it will reach 100MB.
- NodeJS performance are enough for this solution (in terms of the frequency the API is called). If it weren’t, I could use a different language (such as C++, etc.).

## Architecture decisions
- The web-api is supported only locally (as agreed) 
    - The db is lokijs (npm module).
    - The sever is running on localhost. 
- DB
    - A local db will be used as a no-sql db (lokijs).
    - Mutual exclusion between the threads of the server (using a mutex). 
        - If someone opens few-apis in parallel (few tabs), we still want the words will be counted properly.
- API
    - word-counter
        - A single api supports all 3 modes (source parameter tells if it's body/filepath/url). 
            - I could have splitted this to 3 different apis.
        - The api call waits for a result (even if it's a long computation as a result of a really long text). 
        - For a bad url, response will be 404.
        - For a bad filepath, response will be 400.
- Business logic
    - Reading the text as a stream (for filepath/url cases).
-  
        
        


## alternative solution
- If the web-api should have supported no down time at all I would:
    - Use a sql db in the cloud instead of the lokijs.
        - Each independent instance of the backend updates/query the sql db (the mutual exclusion will be given as a built in feature of the SaaS sql db).
    - Use Kubernetes to manage multi-instance web-api (so even if 1 fails, the web-api would be available).
    - Use parallel computing to accelerate the computation: 
        - break the text file to parts, send each part to a service. The service computes independently the words and updates the db.  
