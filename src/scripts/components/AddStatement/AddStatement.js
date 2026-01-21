import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';

import './AddStatement.css';

const AddStatement = ({ addStatement, disabled }) => {
  const context = useContext(SequenceProcessContext);

  return (
    <div
      className="h5p-sequence-add-statement-container"
    >
      <button
        type={'button'}
        className={'h5p-sequence-add'}
        onClick={() => {
          addStatement();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            addStatement();
            event.preventDefault();
          }
        }}
        disabled={disabled}
      >
        {context.translate('add')}
      </button>
    </div>
  );
};

AddStatement.propTypes = {
  addStatement: PropTypes.func,
  disabled: PropTypes.bool,
};

export default AddStatement;
