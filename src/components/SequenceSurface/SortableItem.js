import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ itemId }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: itemId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative',
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div className="h5p-sequence-draggable-container">
      <div
        ref={setNodeRef}
        className="h5p-sequence-draggable-element"
        style={style}
        {...attributes}
        {...listeners}
        tabIndex={0}
      >
        <div className="h5p-sequence-statement">
          <div className="h5p-sequence-statement-remaining">
            <div className="h5p-sequence-drag-element">
              <span className="h5p-ri hri-move" data-no-dnd="true" />
            </div>
            <p className="h5p-sequence-element">{itemId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SortableItem;