from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.callbacks.manager import CallbackManager
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from dotenv import load_dotenv

load_dotenv()

store = {}


def get_google_genai_client(
    model_name: str,
    temperature: float,
    top_p: float,
    callback_manager: CallbackManager = None,
):
    return ChatGoogleGenerativeAI(
        model=model_name,
        temperature=temperature,
        top_p=top_p,
        callback_manager=callback_manager,
    )


def gemini_1_5_flash_8b(callback_manager: CallbackManager = None):
    return get_google_genai_client(
        model_name="gemini-1.5-flash-8b",
        temperature=0,
        top_p=0.001,
        callback_manager=callback_manager,
    )


def get_session_history(session_id: str) -> InMemoryChatMessageHistory:
    global store
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]


def make_conversation_chain(llm: ChatGoogleGenerativeAI):
    global store
    return RunnableWithMessageHistory(llm, get_session_history)
