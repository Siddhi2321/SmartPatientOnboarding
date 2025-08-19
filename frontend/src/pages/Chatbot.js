import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chat } from "../services/api";
import Alert from "../components/Alert";

export default function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      content:
        "Hello! I'm your AI medical assistant. Please describe your symptoms or health concerns.",
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [text, setText] = useState("");
  const [alert, setAlert] = useState(null);
  const historyRef = useRef([]);

  function addMessage(sender, content, extra = {}) {
    setMessages((prev) => [
      ...prev,
      { sender, content, time: new Date().toLocaleTimeString(), ...extra }
    ]);
  }

  function suggestsAppointment(str = "") {
    const ks = ["book", "appointment", "schedule", "consultation", "doctor"];
    return ks.some((k) => str.toLowerCase().includes(k));
  }

  async function send() {
    const message = text.trim();
    if (!message) return;

    const userPart = { role: "user", parts: [{ text: message }] };
    historyRef.current = [...historyRef.current, userPart];
    addMessage("user", message);
    setText("");

    try {
      const { response } = await Chat.send({
        history: historyRef.current,
        message
      });
      historyRef.current = [
        ...historyRef.current,
        { role: "model", parts: [{ text: response }] }
      ];
      addMessage("ai", response, { suggest: suggestsAppointment(response) });
    } catch {
      setAlert({ type: "error", message: "Could not contact assistant" });
    }
  }

  useEffect(() => {
    const el = document.getElementById("chatMessages");
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className="chat-container">
      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* Header */}
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="header-info">
          <i className="fas fa-robot"></i>
          <h2>AI Medical Assistant</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages" id="chatMessages">
        {messages.map((m, idx) => (
          <div key={idx} className={`message ${m.sender}-message`}>
            <div className="message-avatar">
              <i
                className={`fas ${
                  m.sender === "ai" ? "fa-robot" : "fa-user"
                }`}
              ></i>
            </div>
            <div className="message-content">
              <p style={{ whiteSpace: "pre-wrap" }}>{m.content}</p>
              {m.suggest && m.sender === "ai" && (
                <div className="booking-suggestion">
                  <button
                    className="book-appointment-btn"
                    onClick={() => navigate("/book-appointment")}
                  >
                    <i className="fas fa-calendar-plus"></i> Book Appointment
                  </button>
                </div>
              )}
              <span className="message-time">{m.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="chat-input-area">
        <div className="input-container">
          {/* Attachment button (matches your original HTML) */}
          <button
            className="attachment-btn"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <i className="fas fa-camera"></i>
          </button>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (!f.type.startsWith("image/")) {
                setAlert({ type: "error", message: "Please upload a valid image file" });
                return;
              }
              addMessage("user", `[Image uploaded: ${f.name}]`);
              addMessage(
                "ai",
                "I can see the image you've uploaded. However, for a proper medical assessment, please consult our medical professionals."
              );
            }}
          />
          <input
            type="text"
            id="messageInput"
            placeholder="Ask anything to AI Medical Assistant"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="send-btn" onClick={send}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
