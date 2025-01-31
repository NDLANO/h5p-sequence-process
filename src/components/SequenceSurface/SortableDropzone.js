// SortableDropZone.js
import React, { useRef, useState, Fragment, useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import ActionsList from '../Actions/ActionsList';
import Comment from '../Actions/Comment';
import Labels from '../Actions/Labels';
import StatementLabel from '../StatementTypes/components/StatementLabel';

function SortableDropZone({
  id,
  items,
  isUnassignedEmpty,
  comment,
  labels,
  statements,
  onLabelSelect,
  selectedLabels,
  activeCommentId,
  onCommentClick,
  onCommentChange
}) {
  const inputRef = useRef(null);
  const [activeLabelId, setActiveLabelId] = useState(null);

  const { attributes, listeners, setNodeRef } = useSortable({
    id,
    disabled: items.length === 0,
  });

  const handleLabelClick = (itemId) => {
    setActiveLabelId((prevId) => (prevId === itemId ? null : itemId));
  };

  return (
    <div
      ref={setNodeRef}
      className='h5p-sequence-draggable-container'
      {...attributes}
      {...listeners}
    >
      <div className='h5p-droparea'>
        {items.length > 0 ? (
          items.map((itemId) => (
            <Fragment key={itemId}>
              <div className='h5p-sequence-statement'>
                <div className='h5p-sequence-statement-sequenced'>
                  <div className='h5p-sequence-drag-element'>
                    <span className="h5p-ri hri-move" data-no-dnd="true" />
                  </div>
                  <p className="h5p-sequence-element">
                    {statements[itemId]?.content || itemId}
                  </p>
                </div>
                {isUnassignedEmpty && (
                  <Fragment>
                    {labels?.length > 0 && (
                      <ActionsList>
                        <Labels
                          labels={labels}
                          selectedLabelArray={selectedLabels || []}
                          onLabelChange={(labelId) => {
                            if (items[0]) {  // Only call if there's an item in the dropzone
                              onLabelSelect(items[0], labelId);
                            }
                          }}
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
                        isOpen={activeCommentId === items[0]}
                        onClick={() => onCommentClick(items[0])}
                      />
                    </ActionsList>
                  </Fragment>
                )}
              </div>
              <StatementLabel
                labels={labels}
                onLabelChange={(labelId) => onLabelSelect(itemId, labelId, true)}
              />
            </Fragment>
          ))
        ) : (
          <div className='h5p-sequence-empty'></div>
        )}
      </div>
    </div>
  );
}

export default SortableDropZone;
