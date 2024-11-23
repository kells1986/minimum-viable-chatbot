## Minimum Viable Chatbot

This is a simple chatbot built with FastAPI and LangChain. It uses a custom frontend built with HTML, CSS, and JavaScript.

I'm bad at frontend development, so I wanted to build the simplest chatbot possible.

It uses bootstrap CSS for styling and vanilla JavaScript for the frontend logic.

### Running the app

I developed this with python 3.10, but it should work with any version >= 3.9.

#### Keys

Get a Google API key [from here](https://aistudio.google.com/app/apikey).

Add a `.env` file to the root of the project with the following:

```
GOOGLE_API_KEY=<your-google-api-key>
```

#### Development

For development:

```bash
pip install -r requirements.txt
uvicorn app:app --reload
```

This will start the FastAPI server on port 8000. Every time you make a change the server will automatically reload, so will reset the conversation history.