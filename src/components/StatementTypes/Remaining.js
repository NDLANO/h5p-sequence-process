import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DragArrows from './components/DragArrows';
import UnEditableStatement from './components/UnEditableStatement';
import EditableStatement from './components/EditableStatement';
import DeleteStatement from '../DeleteStatement/DeleteStatement';

function Remaining(props) {
  const {
    statement,
    onStatementChange,
    enableEditing = false,
    isDragging = false,
    onStatementDelete,
  } = props;

  let displayStatement;
  if ( enableEditing ) {
    displayStatement = (
      <EditableStatement
        statement={statement.statement}
        inEditMode={statement.editMode}
        onBlur={onStatementChange}
        idBase={statement.id}
      />
    );
  }
  else {
    displayStatement = (
      <UnEditableStatement
        statement={statement.statement}
      />
    );
  }

  return (
    <div
      className={classnames('h5p-sequence-statement', {
        'h5p-sequence-active-draggable': isDragging
      })}
    >
      <div className={'h5p-sequence-statement-remaining'}
        data-no-dnd='true'
      >
        <DeleteStatement
          onClick={onStatementDelete}
        />
        <DragArrows />
        {displayStatement}
      </div>
    </div>
  );

}

Remaining.propTypes = {
  statement: PropTypes.object,
  onStatementChange: PropTypes.func,
  enableEditing: PropTypes.bool,
  onStatementDelete: PropTypes.func,
};

export default Remaining;
