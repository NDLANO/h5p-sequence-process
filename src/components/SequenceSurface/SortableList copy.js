import React, { Fragment, useState, useRef } from 'react';
import { SortableContext } from '@dnd-kit/sortable';
import classnames from 'classnames';

import ActionsList from '../Actions/ActionsList';
import Labels from '../Actions/Labels';
import Comment from '../Actions/Comment';
import Sequenced from '../StatementTypes/Sequenced';
import Remaining from '../StatementTypes/Remaining';
import Placeholder from '../StatementTypes/Placeholder';
import SortableItem from './SortableItem'; // Ensure this path is correct

function SortableList({ items, statements, type, activeId, allowTransition, draggingOver, isSingleColumn, labels, onStatementChange, onStatementDelete }) {
  const inputRef = useRef();
  const [activeCommentId, setActiveCommentId] = useState(null);

  const handleOnLabelChange = (statementId, labelId) => {
    const statement = { ...statements[statementId] };
    let selectedLabels = statement.selectedLabels || [];
    const labelIndex = selectedLabels.indexOf(labelId);

    if (labelIndex !== -1) {
      selectedLabels.splice(labelIndex, 1);
    } 
    else {
      selectedLabels.push(labelId);
    }

    statement.selectedLabels = selectedLabels;
    onStatementChange(statementId, statement);
  };

  const handleOnCommentChange = (statementId, comment) => {
    const statement = { ...statements[statementId] };
    statement.comment = comment;
    onStatementChange(statementId, statement);
  };

  const handleCommentClick = (statementId) => {
    // Toggle based on current state to allow only one comment box to be open
    const shouldShow = activeCommentId !== statementId;
    setActiveCommentId(shouldShow ? statementId : null);
  };

  const handleDraggableType = (type, statement, isDragging, isDraggingOver, activeId, statementId) => {
    const actions = isSingleColumn ? (
      <Fragment>
        {labels.length > 0 && (
          <ActionsList>
            <Labels
              labels={labels}
              selectedLabelArray={statement.selectedLabels}
              onLabelChange={(labelId) => handleOnLabelChange(statement.id, labelId)}
            />
          </ActionsList>
        )}
        <ActionsList>
          <Comment
            onCommentChange={(comment) => handleOnCommentChange(statement.id, comment)}
            comment={statement.comment}
            onClick={() => handleCommentClick(statement.id)}
            showPopover={activeCommentId === statement.id}
            inputRef={inputRef}
          />
        </ActionsList>
      </Fragment>
    ) : <></>;

    if (type === 'remaining') {
      return (
        <Remaining
          statement={statement}
          onStatementChange={() => {}} // Define this function if needed
          enableEditing={true}
          isDragging={isDragging}
          onStatementDelete={() => onStatementDelete(type, statement.id)}
        />
      );
    }

    if (type === 'sequenced' && !statement.isPlaceholder) {
      const isActivelyCommented = activeCommentId === statement.id;
      const hasExistingComment = statement.comment !== null && statement.comment.trim() !== '' && statement.comment !== 'null' && statement.comment !== '';
      
      return (
        <Sequenced
          statement={statement}
          actions={actions}
          enableCommentDisplay={(isActivelyCommented || hasExistingComment)}
          inputRef={inputRef}
          onCommentChange={(comment) => handleOnCommentChange(statement.id, comment)}
          labels={labels}
          onLabelChange={(labelId) => handleOnLabelChange(statement.id, labelId)}
          onStatementChange={() => {}} // Define this function if needed
          enableEditing={true}
          isDragging={isDragging}
          index={null}
          onStatementDelete={() => onStatementDelete(type, statement.id)}
        />
      );
    }

    if (type === 'sequenced' && statement.isPlaceholder) {
      return (
        <Placeholder
          translate={() => {}} // Define this function if needed
          index={statement.index}
          isDraggingOver={isDraggingOver}
        >
          <div id={`sequenced-${statementId}`} className="h5p-sequence-empty" />
        </Placeholder>
      );
    }
  };

  return (
    <SortableContext items={items}>
      <div data-no-dnd="true">
        {items.map((itemId) => {
          const statementId = itemId.split('-').pop(); // Assumes IDs are formatted as 'type-id'
          const statement = statements[statementId];
          const isDragging = activeId === itemId;
          const style = { visibility: isDragging ? 'hidden' : 'visible' };
          const isDraggingOver = draggingOver === itemId;
          const disabled = type === 'sequenced' && statement.isPlaceholder;
          return (
            <SortableItem key={itemId} id={itemId} allowTransition={allowTransition} disabled={disabled} type={type}>
              <div className="h5p-sequence-draggable-container" style={style}>
                <div className={classnames('h5p-sequence-draggable-element', { 'h5p-sequence-no-transform': false })}>
                  {handleDraggableType(type, statement, isDragging, isDraggingOver, activeId, statementId)}
                </div>
              </div>
            </SortableItem>
          );
        })}
      </div>
    </SortableContext>
  );
}

export default SortableList;