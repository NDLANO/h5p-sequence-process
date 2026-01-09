import React, { useRef, useEffect } from 'react';
import SortableItem from './SortableItem.js';
import PropTypes from 'prop-types';

const DraggableOverlay = ({ id, statements, dropzoneGroups }) => {
  const sortableRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (sortableRef.current && typeof sortableRef.current.focus === 'function') {
        sortableRef.current.focus();
      }
    }, 0);

    return () => {
      clearTimeout(t);
    };
  }, [id]);

  const handleBlur = () => {
    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(escapeEvent);
  };

  let statement = statements[id]?.content;

  if (!statement) {
    const dropzone = dropzoneGroups.find((list) => list.id === id);
    if (dropzone && dropzone.items[0]) {
      statement = statements[dropzone.items[0]]?.content;
    }
  }

  return <SortableItem ref={sortableRef} itemId={id} statement={statement} onBlur={handleBlur} />;
};

DraggableOverlay.propTypes = {
  id: PropTypes.string.isRequired,
  statements: PropTypes.object.isRequired,
  dropzoneGroups: PropTypes.array.isRequired,
};

export default DraggableOverlay;
