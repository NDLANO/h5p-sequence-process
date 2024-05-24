import React from 'react';
import PropTypes from 'prop-types';
import Placeholder from './Placeholder';
import classnames from 'classnames';
import DragArrows from './components/DragArrows';
import StatementComment from './components/StatementComment';
import StatementLabel from './components/StatementLabel';
import EditableStatement from './components/EditableStatement';
import UnEditableStatement from './components/UnEditableStatement';
import DeleteStatement from '../DeleteStatement/DeleteStatement';

const Sequenced = (props) => {
  const {
    statement,
    actions,
    enableCommentDisplay,
    onCommentChange,
    inputRef,
    labels,
    onLabelChange,
    onStatementChange,
    enableEditing,
    isDragging = false,
    index,
    prioritizeable,
    onStatementDelete,
  } = props;

  return (
    <Placeholder
      index={index}
      prioritizeable={prioritizeable}
    >
      <div>
        <div
          className={classnames('h5p-sequence-statement', {
            'h5p-sequence-statement-extra': enableCommentDisplay || statement.selectedLabels.length > 0,
            'h5p-sequence-active-draggable': isDragging
          })}
        >
          <div className={'h5p-sequence-statement-sequenced'}>
            <DeleteStatement
              onClick={onStatementDelete}
            />
            <DragArrows />
            {enableEditing === true && (
              <EditableStatement
                inEditMode={statement.editMode}
                statement={statement.statement}
                onBlur={onStatementChange}
                idBase={statement.id}
              />
            )}
            {enableEditing !== true && (
              <UnEditableStatement
                statement={statement.statement}
              />
            )}
          </div>
          {actions}
        </div>
        <div
          className={classnames('h5p-sequence-statement-container', {
            'hidden': (statement.selectedLabels.length === 0 && !enableCommentDisplay)
          })}
        >
          <div>
            <StatementLabel
              selectedLabels={statement.selectedLabels}
              labels={labels}
              onLabelChange={onLabelChange}
            />
            <StatementComment
              comment={statement.comment}
              onCommentChange={onCommentChange}
              inputRef={inputRef}
              show={enableCommentDisplay}
            />
          </div>
        </div>
      </div>
    </Placeholder>
  );

};

Sequenced.propTypes = {
  statement: PropTypes.object,
  actions: PropTypes.object,
  enableCommentDisplay: PropTypes.bool,
  onCommentChange: PropTypes.func,
  inputRef: PropTypes.object,
  labels: PropTypes.array,
  onLabelChange: PropTypes.func,
  onStatementDelete: PropTypes.func,
};

export default Sequenced;
