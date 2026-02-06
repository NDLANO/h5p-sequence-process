// SortableDropZone.js
import React, { forwardRef, useRef, useState, Fragment, useContext, useCallback, useImperativeHandle } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import PropTypes from 'prop-types';
import ActionsList from '@components/Actions/ActionsList.js';
import Comment from '@components/Actions/Comment.js';
import Labels from '@components/Actions/Labels.js';
import PriorityNumber from '@components/StatementTypes/components/PriorityNumber.js';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';
import UnEditableStatement from '@components/StatementTypes/components/UnEditableStatement.js';

import './SortableDropzone.css';

const SortableDropZone = forwardRef((
  {
    index,
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
    onCommentChange,
    isTabbable = false,
    onReceivedFocus = () => {},
    isDragged = false,
    getElementIdentifier = () => '',
    disabled,
  },
  ref
) => {
  const inputRef = useRef(null);
  const [activeLabelId, setActiveLabelId] = useState(null);
  const context = useContext(SequenceProcessContext);
  const { attributes, listeners, setNodeRef } = useSortable({
    id,
    disabled: items.length === 0,
  });
  const dropzoneElementRef = useRef(null);

  const [selectedState, setSelectedState] = useState(false);
  const isPrioritizeable = context.params.mode === 'priority';

  const handleLabelClick = (id) => {
    setActiveLabelId((prevId) => (prevId === id ? null : id));
  };

  const handleFocus = useCallback(() => {
    setSelectedState(true);
    onReceivedFocus(id);
  }, [id, onReceivedFocus]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      dropzoneElementRef.current?.focus();
    }
  }));

  const ariaLabel = (items.length) === 0 ?
    context.translate('dropzone') :
    context.translate('dropzoneWithContent').replace('@content', getElementIdentifier(items[0]));

  return (
    <li
      ref={(node) => {
        setNodeRef(node);
        dropzoneElementRef.current = node;
      }}
      className={`h5p-sequence-draggable-container${isDragged ? ' dragging' : ''}`}
      id={id}
      {...attributes}
      {...listeners}
      tabIndex={isTabbable ? '0' : '-1'}
      aria-describedby={`${id}-description`}
      onFocus={handleFocus}
      onBlur={() => setSelectedState(false)}
      {...(disabled && { onKeyDown: () => {} })} // onKeyDown overwrites dnd-kit handler
      role='listitem'
      aria-label={ariaLabel}
    >
      {isPrioritizeable && (
        <PriorityNumber
          index={index}
        />
      )}
      <div className='h5p-droparea'>
        {(items.length > 0 && !isDragged) ? (
          items.map((itemId) => (
            <Fragment key={itemId}>
              <div className={`h5p-sequence-statement${disabled ? ' disabled' : ''}`}>
                <div className='h5p-sequence-statement-sequenced'>
                  <div className='h5p-sequence-drag-element'></div>
                  <UnEditableStatement
                    statement={statements[itemId]?.content || itemId}
                  />
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
                          disabled={disabled}
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
                        disabled={disabled}
                      />
                    </ActionsList>
                  </Fragment>
                )}
              </div>
            </Fragment>
          ))
        ) : (
          <div className='h5p-sequence-empty'></div>
        )}
      </div>
    </li>
  );
});

SortableDropZone.displayName = 'SortableDropZone';

SortableDropZone.propTypes = {
  index: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  isUnassignedEmpty: PropTypes.bool,
  comment: PropTypes.string,
  labels: PropTypes.array,
  statements: PropTypes.object.isRequired,
  onLabelSelect: PropTypes.func.isRequired,
  selectedLabels: PropTypes.array,
  activeCommentId: PropTypes.string,
  onCommentClick: PropTypes.func.isRequired,
  onCommentChange: PropTypes.func.isRequired,
  isTabbable: PropTypes.bool,
  onReceivedFocus: PropTypes.func,
  isDragged: PropTypes.bool,
  getElementIdentifier: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default SortableDropZone;
