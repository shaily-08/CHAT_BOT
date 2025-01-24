const API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const chatDisplay = document.getElementById("chat-display");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

async function fetchGroqData(messages) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`, // Fixed template literal syntax
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorBody}` // Fixed template literal syntax
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Sorry, I encountered an error. Please try again later.");
  }
}

function appendMessage(content, isUser = false, isError = false) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(
    isUser ? "user-message" : isError ? "error-message" : "bot-message"
  );
  messageElement.textContent = content;
  chatDisplay.appendChild(messageElement);
  chatDisplay.scrollTop = chatDisplay.scrollHeight; // Auto-scroll to the latest message
}

async function handleUserInput() {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    appendMessage(userMessage, true); // Append user's message
    userInput.value = ""; // Clear the input field

    try {
      const messages = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ];

      const botResponse = await fetchGroqData(messages); // Fetch response from API
      appendMessage(botResponse); // Append bot's response
    } catch (error) {
      appendMessage(error.message, false, true); // Handle and display errors
    }
  }
}

// Event listeners for user input and send button
sendButton.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleUserInput();
  }
});

// Clear chat display initially
chatDisplay.innerHTML = "";
