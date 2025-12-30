const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.className = "message " + type;
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msg;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";

    const botMsg = addMessage("", "bot");

    const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        botMsg.textContent += decoder.decode(value);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    fetch("http://localhost:5000/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: botMsg.textContent })
    });
}

async function startVoice() {
    const res = await fetch("http://localhost:5000/voice");
    const data = await res.json();
    userInput.value = data.text;
    sendMessage();
}
