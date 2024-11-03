import React, { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ itemId, activeId }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: itemId });

  const isDragging = activeId === itemId;
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1, // Hide only when actively dragging
    padding: '8px',
    margin: '4px',
    backgroundColor: 'lightgray',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer', // Ensure it's clear the item is clickable/tappable
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {itemId}
    </div>
  );
}

function SortableList({ items }) {
  const [currentItems, setCurrentItems] = useState(items);
  const [activeId, setActiveId] = useState(null);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCurrentItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <SortableContext items={currentItems}>
        {currentItems.map((itemId) => (
          <SortableItem key={itemId} itemId={itemId} activeId={activeId} />
        ))}
      </SortableContext>

      <DragOverlay>
        {activeId ? (
          <div style={{ padding: '8px', backgroundColor: 'lightgray', borderRadius: '4px' }}>
            {activeId}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default SortableList;
