import React, { useRef, useEffect } from 'react';
import SortableItem from './SortableItem.js';
import PropTypes from 'prop-types';
import { useDndContext } from '@dnd-kit/core';

const DraggableOverlay = ({ id, statements, dropzoneGroups }) => {
  const sortableRef = useRef(null);
  const { active } = useDndContext();

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
    // Guard: only cancel if drag is still active for this overlay (not when dropping ended)
    if (!active || active.id !== id) {
      return;
    }

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
