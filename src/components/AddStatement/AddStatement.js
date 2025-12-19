import React from 'react';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import { SequenceProcessContext } from '../../context/SequenceProcessContext.js';

import './AddStatement.css';

function AddStatement({ addStatement }) {

  const context = useContext(SequenceProcessContext);

  return (
    <div
      className="h5p-sequence-add-statement-container"
    >
      <button
        type={'button'}
        className={'h5p-sequence-add'}
        onClick={addStatement}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            addStatement();
            event.preventDefault();
          }
        }}
      >
        <span>
          <span className={'h5p-ri hri-pencil'} />
          <span>{context.translate('add')}</span>
        </span>
      </button>
    </div>
  );
}

AddStatement.propTypes = {
  addStatement: PropTypes.func,
};

export default AddStatement;
