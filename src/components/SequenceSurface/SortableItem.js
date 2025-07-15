import React, { useContext, useRef, useImperativeHandle, forwardRef } from 'react';
import { SequenceProcessContext } from 'context/SequenceProcessContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteStatement from '../DeleteStatement/DeleteStatement';
import EditableStatement from '../StatementTypes/components/EditableStatement';
import UnEditableStatement from '../StatementTypes/components/UnEditableStatement';

const SortableItem = forwardRef(({ itemId, statement, onStatementDelete, onStatementChange, enableEditing = false, allowDelete = false }, ref) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: itemId,
    attributes: {
      'aria-label': statement,
      'aria-describedby': statement,
      'aria-labelledby': 'hi',
    }
  });

  const context = useContext(SequenceProcessContext);
  const editableStatementRef = useRef();

  useImperativeHandle(ref, () => ({
    enterEditMode: () => {
      editableStatementRef.current?.enterEditMode();
    }
  }));

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative',
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div className="h5p-sequence-draggable-container">
      <div
        role="button"
        ref={setNodeRef}
        className="h5p-sequence-draggable-element"
        style={style}
        {...attributes}
        {...listeners}
        tabIndex={0}
        aria-label={`${statement}`}
        aria-describedby={`${statement}`}
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
      </div>
    </div>
  );
});

SortableItem.displayName = 'SortableItem';

export default SortableItem;
