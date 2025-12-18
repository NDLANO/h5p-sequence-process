import React, { useContext, useRef, useImperativeHandle, forwardRef, useCallback, useState } from 'react';
import { SequenceProcessContext } from './../../context/SequenceProcessContext.js';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PropTypes from 'prop-types';
import DeleteStatement from '../DeleteStatement/DeleteStatement.js';
import EditableStatement from '../StatementTypes/components/EditableStatement.js';
import UnEditableStatement from '../StatementTypes/components/UnEditableStatement.js';

import './SortableItem.css';

const SortableItem = forwardRef((
  {
    itemId,
    statement,
    onStatementDelete,
    onStatementChange,
    enableEditing = false,
    allowDelete = false,
    stackedMode = false,
    stackIndex = 0,
    totalItems = 1,
    isTabbable = false,
    onReceivedFocus = () => {},
  },
  ref
) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: itemId,
    attributes: {
      'aria-label': statement,
      'aria-describedby': statement,
      'aria-labelledby': 'hi', // TODO: What's this supposed to be?
    }
  });

  const [selectedState, setSelectedState] = useState(false);

  const context = useContext(SequenceProcessContext);
  const editableStatementRef = useRef();
  const draggableElementRef = useRef(null);

  useImperativeHandle(ref, () => ({
    enterEditMode: () => {
      editableStatementRef.current?.enterEditMode();
    },
    focus: () => {
      draggableElementRef.current?.focus();
    }
  }));

  const style = {
    '--transform': CSS.Transform.toString(transform),
    '--transition': transition,
    '--zIndex': (stackedMode ? totalItems - stackIndex : 1),
  };

  const handleFocus = useCallback(() => {
    setSelectedState(true);
    onReceivedFocus(itemId);
  }, [itemId, onReceivedFocus]);

  const handleBlur = useCallback(() => {
    setSelectedState(false);
  }, []);

  return (
    <div className={`h5p-sequence-draggable-container ${isDragging ? 'dragging' : ''}`} >
      <li
        id={itemId}
        role="option"
        ref={(node) => {
          setNodeRef(node);
          draggableElementRef.current = node;
        }}
        className="h5p-sequence-draggable-element"
        style={style}
        {...attributes}
        {...listeners}
        tabIndex={isTabbable ? 0 : -1}
        aria-label={`${statement}`}
        aria-describedby={`${statement}`}
        aria-selected={selectedState}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <div className="h5p-sequence-statement">
          <div className="h5p-sequence-statement-remaining">
            <div className="h5p-sequence-drag-element">
              <span className="h5p-ri hri-move" data-no-dnd="true" />
              <span className={'visible-hidden'}>{context.translate('drag')}</span>
            </div>
            {/* Conditionally render the statement based on enableEditing */}
            {enableEditing ? (
              <EditableStatement
                ref={editableStatementRef}
                statement={statement}
                onBlur={(newStatement) => onStatementChange(itemId, newStatement)}
                idBase={itemId}
              />
            ) : (
              <UnEditableStatement
                statement={statement}
              />
            )}
            {/* Only show delete button for list1 AND when adding statements is allowed */}
            {allowDelete && <DeleteStatement onClick={() => onStatementDelete(itemId)} />}
          </div>
        </div>
      </li>
    </div>
  );
});

SortableItem.displayName = 'SortableItem';

SortableItem.propTypes = {
  itemId: PropTypes.string.isRequired,
  statement: PropTypes.string.isRequired,
  onStatementDelete: PropTypes.func.isRequired,
  onStatementChange: PropTypes.func.isRequired,
  enableEditing: PropTypes.bool,
  allowDelete: PropTypes.bool,
  stackedMode: PropTypes.bool,
  stackIndex: PropTypes.number,
  totalItems: PropTypes.number,
  isTabbable: PropTypes.bool,
  onReceivedFocus: PropTypes.func,
};

SortableItem.defaultProps = {
  enableEditing: false,
  allowDelete: false,
  stackedMode: false,
  stackIndex: 0,
  totalItems: 1,
  isTabbable: false,
  onReceivedFocus: () => {},
};

export default SortableItem;
