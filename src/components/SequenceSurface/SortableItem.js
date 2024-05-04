import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, children, allowTransition = true, disabled = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    disabled,
    attributes: {
      role: 'none',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: allowTransition ? transition : 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} tabIndex={disabled ? '-1' : '0'}>
      {children}
    </div>
  );
}

export default SortableItem;
