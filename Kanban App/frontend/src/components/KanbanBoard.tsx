"use client";

import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Column } from './Column';
import { BoardState, Card } from '../types/kanban';
import styles from './KanbanBoard.module.css';

const INITIAL_BOARD_STATE: BoardState = {
  cards: {
    'card-1': {
      id: 'card-1',
      title: 'Initialize Next.js App',
      details: 'Set up the project scaffolding, tailwind-free CSS Modules, and eslint configs.',
    },
    'card-2': {
      id: 'card-2',
      title: 'Define Data Schema',
      details: 'Define robust TypeScript interfaces for Cards, Columns, and overall BoardState.',
    },
    'card-3': {
      id: 'card-3',
      title: 'Design Glassmorphism Theme',
      details: 'Draft CSS custom properties for frosted glass components, custom scrollbars, and vibrant gradients.',
    },
    'card-4': {
      id: 'card-4',
      title: 'Implement DND Logic',
      details: 'Integrate @hello-pangea/dnd with strict-mode and SSR hydration guards.',
    },
    'card-5': {
      id: 'card-5',
      title: 'Write Jest Unit Tests',
      details: 'Verify renaming columns, adding cards, and deleting cards update state correctly.',
    },
    'card-6': {
      id: 'card-6',
      title: 'Add Playwright Integration Tests',
      details: 'Automate interactions: column rename, card addition/deletion, and drag-and-drop flows.',
    },
    'card-7': {
      id: 'card-7',
      title: 'Review Project Requirements',
      details: 'Double check Agents.md to ensure no out-of-scope features (e.g. search, archive) are added.',
    },
  },
  columns: {
    'col-1': {
      id: 'col-1',
      title: 'Backlog',
      cardIds: ['card-7'],
    },
    'col-2': {
      id: 'col-2',
      title: 'To Do',
      cardIds: ['card-5', 'card-6'],
    },
    'col-3': {
      id: 'col-3',
      title: 'In Progress',
      cardIds: ['card-3', 'card-4'],
    },
    'col-4': {
      id: 'col-4',
      title: 'Review',
      cardIds: [],
    },
    'col-5': {
      id: 'col-5',
      title: 'Done',
      cardIds: ['card-1', 'card-2'],
    },
  },
  columnOrder: ['col-1', 'col-2', 'col-3', 'col-4', 'col-5'],
};

export const KanbanBoard: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD_STATE);
  const [mounted, setMounted] = useState(false);

  // Guard against NextJS SSR Hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={styles.boardContainer}>
        <header className={styles.boardHeader}>
          <div>
            <h1 className={styles.boardTitle}>Project Board</h1>
            <p className={styles.boardSubtitle}>Loading Board Layout...</p>
          </div>
        </header>
        <div className={styles.boardBody} style={{ opacity: 0.5 }}>
          <p>Preparing workspace...</p>
        </div>
      </div>
    );
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a list
    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = board.columns[source.droppableId];
    const finishColumn = board.columns[destination.droppableId];

    // Reordering within the same column
    if (startColumn === finishColumn) {
      const newCardIds = Array.from(startColumn.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        cardIds: newCardIds,
      };

      setBoard({
        ...board,
        columns: {
          ...board.columns,
          [newColumn.id]: newColumn,
        },
      });
      return;
    }

    // Moving card to a different column
    const startCardIds = Array.from(startColumn.cardIds);
    startCardIds.splice(source.index, 1);
    const newStartColumn = {
      ...startColumn,
      cardIds: startCardIds,
    };

    const finishCardIds = Array.from(finishColumn.cardIds);
    finishCardIds.splice(destination.index, 0, draggableId);
    const newFinishColumn = {
      ...finishColumn,
      cardIds: finishCardIds,
    };

    setBoard({
      ...board,
      columns: {
        ...board.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      },
    });
  };

  const handleRenameColumn = (columnId: string, newTitle: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          title: newTitle,
        },
      },
    }));
  };

  const handleAddCard = (columnId: string, title: string, details: string) => {
    const cardId = `card-${Date.now()}`;
    const newCard: Card = { id: cardId, title, details };

    setBoard((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [cardId]: newCard,
      },
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          cardIds: [...prev.columns[columnId].cardIds, cardId],
        },
      },
    }));
  };

  const handleDeleteCard = (cardId: string) => {
    setBoard((prev) => {
      // 1. Remove card entry
      const { [cardId]: _, ...remainingCards } = prev.cards;

      // 2. Remove card ID from columns
      const updatedColumns = { ...prev.columns };
      Object.keys(updatedColumns).forEach((colId) => {
        updatedColumns[colId] = {
          ...updatedColumns[colId],
          cardIds: updatedColumns[colId].cardIds.filter((id) => id !== cardId),
        };
      });

      return {
        ...prev,
        cards: remainingCards,
        columns: updatedColumns,
      };
    });
  };

  return (
    <div className={`${styles.boardContainer} animate-fade-in`}>
      <header className={styles.boardHeader}>
        <div>
          <h1 className={styles.boardTitle}>Project Board</h1>
          <p className={styles.boardSubtitle}>Organize and track your development tasks</p>
        </div>
      </header>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.boardBody}>
          {board.columnOrder.map((columnId) => {
            const column = board.columns[columnId];
            const columnCards = column.cardIds.map((cardId) => board.cards[cardId]).filter(Boolean);

            return (
              <Column
                key={column.id}
                column={column}
                cards={columnCards}
                onRenameColumn={handleRenameColumn}
                onAddCard={handleAddCard}
                onDeleteCard={handleDeleteCard}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};
