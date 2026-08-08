import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2 } from 'lucide-react';
import { Card } from '../types/kanban';
import styles from './KanbanBoard.module.css';

interface CardItemProps {
  card: Card;
  index: number;
  onDelete: (cardId: string) => void;
}

export const CardItem: React.FC<CardItemProps> = ({ card, index, onDelete }) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.card} ${snapshot.isDragging ? styles.cardDragging : ''}`}
          data-testid={`card-${card.id}`}
        >
          <div className={styles.cardHeader}>
            <h4 className={styles.cardTitle}>{card.title}</h4>
            <button
              onClick={() => onDelete(card.id)}
              className={styles.deleteButton}
              title="Delete Card"
              aria-label={`Delete ${card.title}`}
              type="button"
            >
              <Trash2 size={14} />
            </button>
          </div>
          {card.details && (
            <p className={styles.cardDetails}>{card.details}</p>
          )}
        </div>
      )}
    </Draggable>
  );
};
