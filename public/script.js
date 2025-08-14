const chatEl = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("message");

const KEY = "schoolai_history_v1";
let history = JSON.parse(localStorage.getItem(KEY) || "[]");
const messages = [];

function saveHistory() {
  localStorage.setItem(KEY, JSON.stringify(history));
}

function bubble(role, text) {
  const div = document.createElement("div");
  div.className = `bubble ${role}`;
  
  if (text === '...') {
    div.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  } else {
    div.innerText = text;
  }
  
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function renderHistory() {
  chatEl.innerHTML = "";
  history.forEach(item => bubble(item.role, item.text));
}

function addUser(text) {
  history.push({ role: "user", text });
  messages.push({ role: "user", content: text });
  saveHistory();
  bubble("user", text);
}

function addAssistant(text) {
  history.push({ role: "assistant", text });
  saveHistory();
  bubble("assistant", text);
}

async function sendPrompt(prompt) {
  addUser(prompt);
  input.value = "";
  input.focus();

  bubble("assistant", "...");
  const typingEl = chatEl.lastChild;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    const reply = data.reply || "Sorry, I couldn't generate a reply.";
    
    chatEl.removeChild(typingEl);
    addAssistant(reply);
    messages.push({ role: "assistant", content: reply });
  } catch (e) {
    chatEl.removeChild(typingEl);
    addAssistant("⚠️ Error: " + (e.message || "Something went wrong."));
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const prompt = input.value.trim();
  if (!prompt) return;
  sendPrompt(prompt);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});

if (history.length === 0) {
  const welcome = "Hi! I’m KYT AI. Ask me any study question — math, science, history, or coding.";
  addAssistant(welcome);
} else {
  renderHistory();
}
