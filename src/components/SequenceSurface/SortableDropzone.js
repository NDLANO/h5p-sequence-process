// SortableDropZone.js
import React, { useRef, useState, Fragment, useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ActionsList from '../Actions/ActionsList';
import Comment from '../Actions/Comment';
import Labels from '../Actions/Labels';
import StatementLabel from '../StatementTypes/components/StatementLabel';
import { SequenceProcessContext } from '../../context/SequenceProcessContext';

function SortableDropZone({ id, items, isList1Empty, comment, labels }) {
  const inputRef = useRef(null);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [activeLabelId, setActiveLabelId] = useState(null);
  const context = useContext(SequenceProcessContext);
  const [selectedLabels, setSelectedLabels] = useState({});

  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({
    id,
    disabled: items.length === 0,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isOver ? '#f0f0f0' : undefined,
    opacity: isDragging ? 0 : 1,
    cursor: items.length > 0 ? 'grab' : 'default',
  };

  const handleCommentClick = (itemId) => {
    console.log('Current activeCommentId:', activeCommentId);
    console.log('Item ID clicked:', itemId);
    setActiveCommentId((prevId) => (prevId === itemId ? null : itemId));  // Toggle logic improved

    // Attempt focusing on inputRef
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleLabelClick = (itemId) => {
    setActiveLabelId((prevId) => (prevId === itemId ? null : itemId));
  };

  const onCommentChange = (newComment) => {
    console.log('Comment changed:', newComment);
  };

  const onLabelChange = (newLabels) => {
    console.log('Labels changed:', newLabels);
  };

  const handleLabelChange = (itemId, labelId, shouldRemove = false) => {
    setSelectedLabels(prev => {
      const currentLabels = prev[itemId] || [];
      let newLabels;
      
      // If shouldRemove is true, remove the label
      if (shouldRemove) {
        newLabels = currentLabels.filter(id => id !== labelId);
        onLabelChange(labelId); // Log the removed label
      } else {
        // Otherwise toggle as before
        newLabels = currentLabels.includes(labelId)
          ? currentLabels.filter(id => id !== labelId)
          : [...currentLabels, labelId];
        onLabelChange(labelId); // Log the toggled label
      }
      
      return {
        ...prev,
        [itemId]: newLabels
      };
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='h5p-sequence-draggable-container'
      {...attributes}
      {...listeners}
    >
      <div className='h5p-droparea'>
        {items.length > 0 ? (
          items.map((itemId) => (
            <>
            <div className='h5p-sequence-statement' key={itemId}>
              <div className='h5p-sequence-statement-sequenced'>
                <div className='h5p-sequence-drag-element'>
                  <span className="h5p-ri hri-move" data-no-dnd="true" />
                </div>
                <p className="h5p-sequence-element">{itemId}</p>
              </div>
              {isList1Empty && (
                <Fragment>
                  {labels && labels.length > 0 && (
                    <ActionsList>
                      <Labels
                        labels={labels}
                        selectedLabelArray={selectedLabels[itemId] || []}
                        onLabelChange={(labelId) => handleLabelChange(itemId, labelId)}
                        isOpen={activeLabelId === itemId}
                        onClick={() => handleLabelClick(itemId)}
                      />
                    </ActionsList>
                  )}
                  <ActionsList>
                    <Comment
                      onCommentChange={onCommentChange}
                      comment={comment}
                      inputRef={inputRef}
                      isOpen={activeCommentId === itemId}
                      onClick={() => handleCommentClick(itemId)}
                    />
                  </ActionsList>
                </Fragment>
              )}
            </div>
            <>
              <StatementLabel
                selectedLabels={selectedLabels[itemId] || []}
                labels={labels}
                onLabelChange={(labelId) => handleLabelChange(itemId, labelId, true)}
              />
            </>
            </>
          ))
        ) : (
          <div className='h5p-sequence-empty'></div>
        )}
      </div>
    </div>
  );
}

export default SortableDropZone;
