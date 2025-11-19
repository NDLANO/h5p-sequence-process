import React from 'react';
import SortableItem from './SortableItem.js';
import PropTypes from 'prop-types';

function DraggableOverlay({ id, statements, dropzoneGroups }) {
  let statement = statements[id]?.content;

  if (!statement) {
    const dropzone = dropzoneGroups.find((list) => list.id === id);
    if (dropzone && dropzone.items[0]) {
      statement = statements[dropzone.items[0]]?.content;
    }
  }

  return <SortableItem itemId={id} statement={statement} />;
}

DraggableOverlay.propTypes = {
  id: PropTypes.string.isRequired,
  statements: PropTypes.object.isRequired,
  dropzoneGroups: PropTypes.array.isRequired,
};

export default DraggableOverlay;
