```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: User writes into the text field and clicks the Save button

    Note right of browser: The browser instantly adds note to local array and redraws UI (Bad Practice: updating UI before confirmation)

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa (Header: Content-Type: application/json) (Payload: { "content": "...", "date": "..." })
    activate server
    Note left of server: The server appends the new note to its in-memory array (no database)
    server-->>browser: 201 Created (Payload: {"message":"note created"})
    deactivate server

    Note right of browser: Browser logs response to console. No page reload or further HTTP requests.