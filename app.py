from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from llms import gemini_1_5_flash_8b, make_conversation_chain, store

app = FastAPI()
_llm = gemini_1_5_flash_8b()
_conversation_chain = make_conversation_chain(_llm)


# Example API endpoint
@app.post("/api/chat")
async def chat(request: Request):
    data = await request.json()
    message = data.get("message", "")
    session_id = data.get("session_id")

    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    response = _conversation_chain.invoke(
        message,
        config={"configurable": {"session_id": session_id}},
    )
    response_text = response.content
    return {"message": response_text}


@app.post("/api/reset")
async def reset_session(request: Request):
    data = await request.json()
    session_id = data.get("session_id")

    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    # Clear the session history
    if session_id in store:
        del store[session_id]

    return {"status": "Session reset"}


@app.get("/api/status")
async def status():
    return {"status": "ok"}


# Serve static files and index.html
app.mount("/", StaticFiles(directory="ui", html=True), name="ui")
