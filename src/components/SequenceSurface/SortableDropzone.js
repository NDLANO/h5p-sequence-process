// SortableDropZone.js
import React, { forwardRef, useRef, useState, Fragment, useContext, useCallback, useImperativeHandle } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import PropTypes from 'prop-types';
import ActionsList from '../Actions/ActionsList.js';
import Comment from '../Actions/Comment.js';
import Labels from '../Actions/Labels.js';
import StatementLabel from '../StatementTypes/components/StatementLabel.js';
import PriorityNumber from '../StatementTypes/components/PriorityNumber.js';
import { SequenceProcessContext } from './../../context/SequenceProcessContext.js';

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

  return (
    <li
      ref={(node) => {
        setNodeRef(node);
        dropzoneElementRef.current = node;
      }}
      className='h5p-sequence-draggable-container'
      id={id}
      {...attributes}
      {...listeners}
      tabIndex={isTabbable ? 0 : -1}
      aria-selected={selectedState} // Does this make sense?
      onFocus={handleFocus}
      onBlur={() => setSelectedState(false)}
      role='option'
    >
      {isPrioritizeable && (
        <PriorityNumber
          index={index}
        />
      )}
      <div className='h5p-droparea'>
        {items.length > 0 ? (
          items.map((itemId) => (
            <Fragment key={itemId}>
              <div className='h5p-sequence-statement'>
                <div className='h5p-sequence-statement-sequenced'>
                  <div className='h5p-sequence-drag-element'>
                    <span className="h5p-ri hri-move" data-no-dnd="true" />
                    <span className={'visible-hidden'}>{context.translate('drag')}</span>
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
};

export default SortableDropZone;
