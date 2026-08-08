'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { MessageSquare, Plus, Edit2, Trash2, LogOut, Send, Bot, User, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface Card {
  id: number;
  column_id: number;
  title: string;
  description: string;
  position: number;
}

interface Column {
  id: number;
  title: string;
  position: number;
  cards: Card[];
}

interface Board {
  id: number;
  title: string;
  columns: Column[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function KanbanApp() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [board, setBoard] = useState<Board | null>(null);
  const [editingColumn, setEditingColumn] = useState<{ id: number; title: string } | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [newCardColumnId, setNewCardColumnId] = useState<number | null>(null);
  const [cardTitle, setCardTitle] = useState('');
  const [cardDesc, setCardDesc] = useState('');

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kanban_token');
    if (saved) {
      setToken(saved);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchBoard();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        localStorage.setItem('kanban_token', data.token);
      } else {
        setAuthError('Invalid credentials (use "user" / "password")');
      }
    } catch {
      setAuthError('Failed to connect to backend server');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('kanban_token');
  };

  const fetchBoard = async () => {
    try {
      const res = await fetch('/api/board', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBoard(data);
      }
    } catch (err) {
      console.error('Fetch board error:', err);
    }
  };

  const handleRenameColumn = async (id: number, newTitle: string) => {
    try {
      await fetch(`/api/columns/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });
      fetchBoard();
      setEditingColumn(null);
    } catch (err) {
      console.error('Rename column error:', err);
    }
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardColumnId || !cardTitle.trim()) return;
    try {
      await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          column_id: newCardColumnId,
          title: cardTitle,
          description: cardDesc,
        }),
      });
      fetchBoard();
      setNewCardColumnId(null);
      setCardTitle('');
      setCardDesc('');
    } catch (err) {
      console.error('Create card error:', err);
    }
  };

  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;
    try {
      await fetch(`/api/cards/${editingCard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editingCard.title,
          description: editingCard.description,
          column_id: editingCard.column_id,
          position: editingCard.position,
        }),
      });
      fetchBoard();
      setEditingCard(null);
    } catch (err) {
      console.error('Update card error:', err);
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    try {
      await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBoard();
      setEditingCard(null);
    } catch (err) {
      console.error('Delete card error:', err);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || !board) return;
    const { source, destination, draggableId } = result;
    const cardId = parseInt(draggableId);
    const destColumnId = parseInt(destination.droppableId);

    const newColumns = [...board.columns];
    const sourceCol = newColumns.find((c) => c.id === parseInt(source.droppableId));
    const destCol = newColumns.find((c) => c.id === destColumnId);

    if (!sourceCol || !destCol) return;

    const [movedCard] = sourceCol.cards.splice(source.index, 1);
    movedCard.column_id = destColumnId;
    destCol.cards.splice(destination.index, 0, movedCard);

    setBoard({ ...board, columns: newColumns });

    try {
      await fetch(`/api/cards/${cardId}/move`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          column_id: destColumnId,
          position: destination.index,
        }),
      });
    } catch (err) {
      console.error('Move card error:', err);
    }
  };

  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || aiLoading) return;

    const userText = inputMessage;
    setInputMessage('');
    const updatedMessages = [...messages, { role: 'user' as const, content: userText }];
    setMessages(updatedMessages);
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userText,
          history: updatedMessages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...updatedMessages, { role: 'assistant', content: data.message }]);
        fetchBoard();
      } else {
        setMessages([
          ...updatedMessages,
          { role: 'assistant', content: 'Failed to communicate with AI endpoint.' },
        ]);
      }
    } catch {
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: 'Network error connecting to AI.' },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#032147] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border-t-4 border-[#753991]">
          <h1 className="text-2xl font-bold text-[#032147] mb-2 text-center">Commercial Kanban</h1>
          <p className="text-[#888888] text-sm text-center mb-6">Sign in to manage your board</p>

          {authError && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4 text-center border border-red-200">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#209dd7] focus:outline-none"
                placeholder="user"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#209dd7] focus:outline-none"
                placeholder="password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#753991] hover:bg-[#602b79] text-white font-semibold py-2.5 rounded-lg transition-colors shadow-md"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-[#032147] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="h-4 w-1 bg-[#ecad0a] rounded"></div>
          <h1 className="text-xl font-bold tracking-wide">Commercial Kanban</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-300">Logged in as <strong className="text-white">user</strong></span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 px-3 py-1.5 rounded-md text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Kanban Board */}
        <main className="flex-1 p-6 overflow-x-auto">
          {board ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex space-x-6 h-full items-start">
                {board.columns.map((col) => (
                  <div
                    key={col.id}
                    className="bg-white border border-gray-200 rounded-xl w-80 min-w-[20rem] flex flex-col shadow-sm max-h-[82vh]"
                  >
                    {/* Column Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      {editingColumn?.id === col.id ? (
                        <input
                          type="text"
                          value={editingColumn.title}
                          onChange={(e) => setEditingColumn({ ...editingColumn, title: e.target.value })}
                          onBlur={() => handleRenameColumn(col.id, editingColumn.title)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRenameColumn(col.id, editingColumn.title)}
                          className="font-semibold text-[#032147] border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#209dd7] w-full"
                          autoFocus
                        />
                      ) : (
                        <div
                          onClick={() => setEditingColumn({ id: col.id, title: col.title })}
                          className="flex items-center space-x-2 cursor-pointer group"
                        >
                          <h2 className="font-bold text-[#032147] text-base group-hover:text-[#209dd7]">
                            {col.title}
                          </h2>
                          <span className="text-xs bg-gray-100 text-[#888888] font-medium px-2 py-0.5 rounded-full">
                            {col.cards.length}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setNewCardColumnId(col.id);
                          setCardTitle('');
                          setCardDesc('');
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#753991] transition-colors"
                        title="Add Card"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Cards Container */}
                    <Droppable droppableId={col.id.toString()}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[150px]"
                        >
                          {col.cards.map((card, index) => (
                            <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group border-l-4 border-l-[#209dd7]"
                                >
                                  <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-gray-800 text-sm">{card.title}</h3>
                                    <button
                                      onClick={() => setEditingCard(card)}
                                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-[#753991] transition-opacity"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  {card.description && (
                                    <p className="text-xs text-[#888888] mt-1.5 line-clamp-2">
                                      {card.description}
                                    </p>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          ) : (
            <div className="text-center py-12 text-[#888888]">Loading Kanban board...</div>
          )}
        </main>

        {/* AI Sidebar */}
        <aside
          className={`bg-white border-l border-gray-200 flex flex-col transition-all duration-300 shadow-lg ${
            sidebarOpen ? 'w-96' : 'w-12'
          }`}
        >
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-[#753991]" />
                <h2 className="font-bold text-[#032147]">AI Assistant</h2>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-gray-200 rounded-md text-gray-500 transition-colors"
            >
              {sidebarOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {sidebarOpen && (
            <>
              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#888888]">
                    Ask the AI to create, edit, or move cards on your Kanban board!
                  </div>
                ) : (
                  messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex space-x-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {m.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-full bg-[#753991]/10 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-[#753991]" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-xl px-3.5 py-2 text-sm ${
                          m.role === 'user'
                            ? 'bg-[#209dd7] text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))
                )}
                {aiLoading && (
                  <div className="flex items-center space-x-2 text-xs text-[#888888]">
                    <Bot className="w-4 h-4 animate-spin text-[#753991]" />
                    <span>AI is thinking...</span>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendAiMessage} className="p-3 border-t border-gray-100 flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="e.g. Add a card to To Do..."
                  className="flex-1 text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#753991] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="bg-[#753991] hover:bg-[#602b79] text-white p-2 rounded-lg transition-colors shadow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </aside>
      </div>

      {/* Add Card Modal */}
      {newCardColumnId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#032147] mb-4">Create New Card</h3>
            <form onSubmit={handleCreateCard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#209dd7] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea
                  value={cardDesc}
                  onChange={(e) => setCardDesc(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#209dd7] focus:outline-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setNewCardColumnId(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-[#753991] text-white font-medium rounded-lg hover:bg-[#602b79]"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Card Modal */}
      {editingCard && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#032147]">Edit Card</h3>
              <button
                onClick={() => handleDeleteCard(editingCard.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Delete Card"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateCard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#209dd7] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea
                  value={editingCard.description}
                  onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#209dd7] focus:outline-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-[#753991] text-white font-medium rounded-lg hover:bg-[#602b79]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
