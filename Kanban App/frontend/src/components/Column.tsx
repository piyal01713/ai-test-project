import React, { useState, useRef } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Card, Column as ColumnType } from '../types/kanban';
import { CardItem } from './CardItem';
import styles from './KanbanBoard.module.css';

interface ColumnProps {
  column: ColumnType;
  cards: Card[];
  onRenameColumn: (columnId: string, newTitle: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  cards,
  onRenameColumn,
  onAddCard,
  onDeleteCard,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [colTitle, setColTitle] = useState(column.title);
  const formRef = useRef<HTMLDivElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    const trimmed = colTitle.trim();
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed);
    } else {
      setColTitle(column.title);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      onAddCard(column.id, trimmedTitle, details.trim());
      setTitle('');
      setDetails('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDetails('');
    setIsAdding(false);
  };

  return (
    <div className={styles.column} data-testid={`column-${column.id}`}>
      <div className={styles.columnHeader}>
        <input
          type="text"
          value={colTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          className={styles.columnTitleInput}
          aria-label={`Rename column ${column.title}`}
          data-testid={`column-title-input-${column.id}`}
        />
        <span className={styles.cardCount}>{cards.length}</span>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${styles.cardsContainer} ${
              snapshot.isDraggingOver ? styles.columnDraggingOver : ''
            }`}
            data-testid={`droppable-${column.id}`}
          >
            {cards.map((card, idx) => (
              <CardItem
                key={card.id}
                card={card}
                index={idx}
                onDelete={onDeleteCard}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {isAdding ? (
        <div ref={formRef} className={styles.addCardForm}>
          <input
            type="text"
            placeholder="Card Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.inputField}
            autoFocus
            required
            data-testid={`new-card-title-${column.id}`}
          />
          <textarea
            placeholder="Details..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className={styles.textAreaField}
            data-testid={`new-card-details-${column.id}`}
          />
          <div className={styles.formActions}>
            <button
              onClick={handleCancel}
              className={styles.buttonCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className={styles.buttonSubmit}
              type="button"
              data-testid={`submit-card-${column.id}`}
            >
              Add Card
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className={styles.addCardButton}
          type="button"
          data-testid={`add-card-btn-${column.id}`}
        >
          <Plus size={16} />
          Add Card
        </button>
      )}
    </div>
  );
};
