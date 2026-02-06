import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';
import './DeleteStatement.css';

/**
 * @return {null}
 */
const DeleteStatement = (props) => {

  const context = useContext(SequenceProcessContext);

  const {
    behaviour: {
      allowAddingOfStatements = false,
    }
  } = context;

  const {
    isTabbable = false,
    onClick
  } = props;

  if (allowAddingOfStatements !== true) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      onKeyUp={(event) => {
        if (event.key === 'Backspace') {
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
      tabIndex={isTabbable ? '0' : '-1'}
      type={'button'}
      aria-label={context.translate('close')}
    >
    </button>
  );
};

DeleteStatement.propTypes = {
  isTabbable: PropTypes.bool,
  onClick: PropTypes.func,
};

export default DeleteStatement;
