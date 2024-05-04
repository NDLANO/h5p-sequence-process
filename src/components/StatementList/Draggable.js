import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

function Draggable({ draggableId, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: draggableId,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  // Assuming children as a function for rendering with dragging context
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {typeof children === 'function' ? children() : children}
    </div>
  );
}

export default Draggable;