"use client";

import React, { FormEvent, useRef, useState } from "react";
import { Card, Column, deleteCard, initialColumns, moveCard } from "../lib/board";

function createCard(title: string, details: string): Card {
  return { id: `card-${Date.now()}`, title, details };
}

export function Board() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const draggedCard = useRef<string | null>(null);

  function renameColumn(id: string, title: string) {
    setColumns((current) => current.map((column) => column.id === id ? { ...column, title: title.trim() || "Untitled" } : column));
  }

  function addCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeColumn) return;
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const details = String(form.get("details") || "").trim();
    if (!title) return;
    setColumns((current) => current.map((column) => column.id === activeColumn
      ? { ...column, cards: [...column.cards, createCard(title, details)] }
      : column));
    setIsComposerOpen(false);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#board" aria-label="Horizon board home"><span className="brand-mark">H</span>Horizon</a>
        <div className="topbar-actions"><span className="member-count">Product team</span><span className="avatar">AM</span></div>
      </header>

      <section className="hero" aria-labelledby="board-title">
        <div><p className="eyebrow">Product planning</p><h1 id="board-title">Q3 roadmap</h1><p className="subtitle">A shared view of what the team is exploring, building, and shipping.</p></div>
        <button className="new-card" onClick={() => { setActiveColumn(columns[0].id); setIsComposerOpen(true); }}>New card <span>+</span></button>
      </section>

      <section id="board" className="board" aria-label="Q3 roadmap board">
        {columns.map((column) => (
          <section className="column" key={column.id} aria-labelledby={`${column.id}-heading`} onDragOver={(event) => event.preventDefault()} onDrop={() => {
            if (draggedCard.current) setColumns((current) => moveCard(current, draggedCard.current!, column.id));
            draggedCard.current = null;
          }}>
            <div className="column-heading"><input id={`${column.id}-heading`} aria-label={`${column.title} column name`} value={column.title} onChange={(event) => renameColumn(column.id, event.target.value)} /><span>{column.cards.length}</span></div>
            <div className="cards">
              {column.cards.map((card) => <article className="card" draggable key={card.id} onDragStart={() => { draggedCard.current = card.id; }}>
                <button className="delete-card" onClick={() => setColumns((current) => deleteCard(current, card.id))} aria-label={`Delete ${card.title}`}>×</button>
                <h2>{card.title}</h2><p>{card.details || "No details added."}</p>
              </article>)}
            </div>
            <button className="add-card" onClick={() => { setActiveColumn(column.id); setIsComposerOpen(true); }}>+ Add card</button>
          </section>
        ))}
      </section>

      {isComposerOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsComposerOpen(false)}>
        <form className="composer" aria-label="Add a new card" onSubmit={addCard} onMouseDown={(event) => event.stopPropagation()}>
          <div className="composer-heading"><div><p className="eyebrow">New work item</p><h2>Add a card</h2></div><button type="button" className="close" onClick={() => setIsComposerOpen(false)} aria-label="Close">×</button></div>
          <label>Title<input name="title" autoFocus placeholder="What needs to happen?" /></label>
          <label>Details<textarea name="details" rows={4} placeholder="Add a little context…" /></label>
          <div className="composer-actions"><button type="button" className="cancel" onClick={() => setIsComposerOpen(false)}>Cancel</button><button type="submit" className="save">Add card</button></div>
        </form>
      </div>}
    </main>
  );
}
