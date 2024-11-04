import React from 'react';
import SortableItem from './SortableItem';

function DraggableOverlay({ id, statements, column2Lists }) {
  let statement = statements[id]?.content;
  
  if (!statement) {
    const dropzone = column2Lists.find(list => list.id === id);
    if (dropzone && dropzone.items[0]) {
      statement = statements[dropzone.items[0]]?.content;
    }
  }

  console.log('drag', 'id', id, 'statement', statement);
  return <SortableItem itemId={id} statement={statement} />;
}

export default DraggableOverlay;
