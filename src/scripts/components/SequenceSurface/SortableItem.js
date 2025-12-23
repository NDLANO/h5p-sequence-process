import React, { useContext, useRef, useImperativeHandle, forwardRef, useCallback, useState } from 'react';
import { SequenceProcessContext } from '../../context/SequenceProcessContext.js';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PropTypes from 'prop-types';
import DeleteStatement from '@components/DeleteStatement/DeleteStatement.js';
import EditableStatement from '@components/StatementTypes/components/EditableStatement.js';
import UnEditableStatement from '@components/StatementTypes/components/UnEditableStatement.js';

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
    isDragged = false,
    heightOfPreviousSiblings,
  },
  ref
) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: itemId
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
    },
    getElementHeight: () => {
      return draggableElementRef.current?.offsetHeight || 0;
    }
  }));

  const style = {
    '--transform': CSS.Transform.toString(transform),
    '--transition': transition,
    '--top': stackedMode ? `-${heightOfPreviousSiblings}px` : 'auto',
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
    <li
      {...attributes}
      {...listeners}
      className={`h5p-sequence-draggable-container${isDragged ? ' dragging' : ''}`}
      style={style}
      role='listitem'
      id={itemId}
      ref={(node) => {
        setNodeRef(node);
        draggableElementRef.current = node;
      }}
      aria-label={`${statement}`}
      aria-describedby={`${statement}`}
      aria-selected={selectedState}
      aria-roledescription={context.translate('sortableItem')}
      tabIndex={isTabbable ? 0 : -1}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className="h5p-sequence-draggable-element">
        <div className="h5p-sequence-statement">
          <div className="h5p-sequence-statement-remaining">
            <div className="h5p-sequence-drag-element">
              <span className="h5p-ri hri-move" data-no-dnd="true" />
            </div>
            {/* Conditionally render the statement based on enableEditing */}
            {enableEditing ? (
              <EditableStatement
                ref={editableStatementRef}
                statement={statement}
                isTabbable={isTabbable}
                onBlur={(newStatement) => onStatementChange(itemId, newStatement)}
                idBase={itemId}
              />
            ) : (
              <UnEditableStatement
                statement={statement}
              />
            )}
            {/* Only show delete button for list1 AND when adding statements is allowed */}
            {allowDelete && <DeleteStatement isTabbable={isTabbable} onClick={() => onStatementDelete(itemId)} />}
          </div>
        </div>
      </div>
    </li>
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
  isDragged: PropTypes.bool,
  heightOfPreviousSiblings: PropTypes.number,
};

SortableItem.defaultProps = {
  enableEditing: false,
  allowDelete: false,
  stackedMode: false,
  stackIndex: 0,
  totalItems: 1,
  isTabbable: false,
  onReceivedFocus: () => {},
  isDragged: false,
};

export default SortableItem;
