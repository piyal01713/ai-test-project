import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { KanbanBoard } from '../components/KanbanBoard';

jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: any) => children,
  Droppable: ({ children }: any) => children({
    draggableProps: {},
    droppableProps: {},
    innerRef: jest.fn(),
    placeholder: null,
  }, { isDraggingOver: false }),
  Draggable: ({ children }: any) => children({
    draggableProps: {},
    dragHandleProps: {},
    innerRef: jest.fn(),
  }, { isDragging: false }),
}));

describe('Kanban Board Unit Tests', () => {
  it('renders all 5 initial columns with titles', () => {
    render(<KanbanBoard />);
    expect(screen.getByDisplayValue('Backlog')).toBeInTheDocument();
    expect(screen.getByDisplayValue('To Do')).toBeInTheDocument();
    expect(screen.getByDisplayValue('In Progress')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Review')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Done')).toBeInTheDocument();
  });

  it('allows renaming a column', () => {
    render(<KanbanBoard />);
    const input = screen.getByDisplayValue('Backlog');
    fireEvent.change(input, { target: { value: 'New Backlog Title' } });
    fireEvent.blur(input);
    expect(screen.getByDisplayValue('New Backlog Title')).toBeInTheDocument();
  });

  it('allows adding a card to a column', () => {
    render(<KanbanBoard />);
    
    // Find the Add Card button for 'To Do' column (col-2)
    const addBtn = screen.getByTestId('add-card-btn-col-2');
    fireEvent.click(addBtn);

    // Form inputs
    const titleInput = screen.getByTestId('new-card-title-col-2');
    const detailsInput = screen.getByTestId('new-card-details-col-2');
    const submitBtn = screen.getByTestId('submit-card-col-2');

    fireEvent.change(titleInput, { target: { value: 'Test New Task' } });
    fireEvent.change(detailsInput, { target: { value: 'This is a test detail' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Test New Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test detail')).toBeInTheDocument();
  });

  it('allows deleting a card', () => {
    render(<KanbanBoard />);
    
    // 'Initialize Next.js App' is in 'Done' column initially (card-1)
    const cardTitle = screen.getByText('Initialize Next.js App');
    expect(cardTitle).toBeInTheDocument();

    const deleteBtn = screen.getByLabelText('Delete Initialize Next.js App');
    fireEvent.click(deleteBtn);

    expect(screen.queryByText('Initialize Next.js App')).not.toBeInTheDocument();
  });
});
