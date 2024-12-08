# server
Source code for our Express server. The Express server handles incoming API requests. It validates the requests and sends back the appropriate response.

## Folders
- controllers: This is where the bulk of the server logic is. There is a controller for each endpoint. The controllers are responsible for validating the request and fufilling it. If the request is a valid database operation the corrosponding dabase function is called. These are located in /backend/src/database/controllers.
- routes: These handle the incoming requests. If the request is to a valid endpoint, the request is passed to that endpoint's controller for further processing.

## Files
- server.ts: This is the Express server itself. It is where the incoming requests are handed over to the routers.
