const chatWindow = document.querySelector(".chat-window");
const userInput = document.querySelector("#user-input");
const sendButton = document.querySelector("#send-button");
const resetButton = document.querySelector("#reset-button");

//Styles to apply for messages
const userMessageClassList = [
  "alert",
  "alert-primary",
  "d-inline-block",
  "mb-2",
];
const userMessageWrapperClassList = ["d-flex", "justify-content-end"];
const botMessageClassList = [
  "alert",
  "alert-secondary",
  "d-inline-block",
  "mb-2",
];
const botMessageWrapperClassList = ["d-flex", "justify-content-start"];

//Event listeners
userInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleSend();
  }
});

sendButton.addEventListener("click", handleSend);

resetButton.addEventListener("click", resetChat);

//Adds a message to the chat window
function addMessage(text, isUser = false) {
  const messageElement = document.createElement("div");

  // Convert markdown to HTML using marked.js
  messageElement.innerHTML = marked.marked(text);

  // Add Bootstrap classes to style the message element
  messageElement.classList.add(
    ...(isUser ? userMessageClassList : botMessageClassList)
  );

  // Create a wrapper div to use flexbox for alignment
  const messageWrapper = document.createElement("div");
  messageWrapper.classList.add(
    ...(isUser ? userMessageWrapperClassList : botMessageWrapperClassList)
  );

  // Append the message element to the wrapper
  messageWrapper.appendChild(messageElement);

  // Append the wrapper to the chat window
  chatWindow.appendChild(messageWrapper);

  // Scroll to the bottom of the chat window
  chatWindow.scrollTop = chatWindow.scrollHeight;

  if (isUser) {
    userInput.value = "";
  }
}

function getSessionId() {
  let sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("session_id", sessionId);
  }
  return sessionId;
}

async function getBotResponse(text) {
  const sessionId = getSessionId();
  try {
    console.log("Sending request to /api/chat with message:", text);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text, session_id: sessionId }),
    });
    console.log("Response:", response);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error fetching bot response:", error);
    return "Sorry, there was an error processing your request.";
  }
}

function addTypingIndicator() {
  const typingElement = document.createElement("div");
  typingElement.classList.add(
    "typing-indicator",
    "alert",
    "alert-secondary",
    "d-inline-block",
    "mb-2"
  );

  // Add the typing dots animation
  typingElement.innerHTML = `
    <span class="dot">.</span>
    <span class="dot">.</span>
    <span class="dot">.</span>
  `;

  const typingWrapper = document.createElement("div");
  typingWrapper.classList.add("d-flex", "justify-content-start");
  typingWrapper.appendChild(typingElement);

  chatWindow.appendChild(typingWrapper);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  return typingWrapper;
}

async function handleSend() {
  const text = userInput.value;
  console.log(text);
  addMessage(text, true);
  // Add typing indicator
  const typingIndicator = addTypingIndicator();

  const botResponse = await getBotResponse(text);

  // Remove typing indicator
  chatWindow.removeChild(typingIndicator);

  // Add bot response
  addMessage(botResponse, false);
}

function resetChat() {
  // Clear the chat window
  chatWindow.innerHTML = "";

  // Clear session history on the server
  const sessionId = getSessionId();
  fetch("/api/reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session_id: sessionId }),
  }).then((response) => {
    if (!response.ok) {
      console.error("Failed to reset session history");
    }
  });

  // Optionally, clear the session ID to start a new session
  localStorage.removeItem("session_id");
}

export { handleSend };
