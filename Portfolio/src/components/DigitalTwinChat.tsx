'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function DigitalTwinChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Nazmul's Digital Twin. Ask me anything about my career, skills, or experience!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices[0]?.message?.content || "Sorry, I couldn't process that.";
        setMessages([...newMessages, { role: 'assistant', content: reply }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: "Oops, something went wrong on my end. Please try again later." }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: "Oops, something went wrong on my end. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chat-widget-container ${isOpen ? 'open' : ''}`}>
      {isOpen && (
        <div className="chat-window glass-card">
          <div className="chat-header">
            <h3>Digital Twin AI</h3>
            <button onClick={toggleChat} className="chat-close-btn" aria-label="Close chat">×</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                <div className="chat-bubble">
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message assistant">
                <div className="chat-bubble typing-indicator">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="chat-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about my career..."
              className="chat-input"
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="chat-send-btn">
              Send
            </button>
          </form>
        </div>
      )}
      {!isOpen && (
        <button onClick={toggleChat} className="chat-toggle-btn glass-card">
          <span className="chat-icon">💬</span>
        </button>
      )}
    </div>
  );
}
