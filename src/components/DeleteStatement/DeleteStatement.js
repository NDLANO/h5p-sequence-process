import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { SequenceProcessContext } from 'context/SequenceProcessContext';

/**
 * @return {null}
 */
function DeleteStatement(props) {

  const context = useContext(SequenceProcessContext);

  const {
    behaviour: {
      allowAddingOfStatements = false,
    }
  } = context;

  const {
    onClick
  } = props;

  if (allowAddingOfStatements !== true) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      onKeyUp={(event) => {
        if (event.keyCode && event.keyCode === 8) {
          onClick();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          onClick();
        }
      }}
      className={'h5p-sequence-delete-button'}
      tabIndex={0}
      type={'button'}
    >
      <span
        className={'h5p-ri hri-times'}
      />
      <span className="h5p-sequence-delete-text">{context.translate('close')}</span>
    </button>
  );
}

DeleteStatement.propTypes = {
  onClick: PropTypes.func,
};

export default DeleteStatement;
