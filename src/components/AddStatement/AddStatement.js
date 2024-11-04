import React from 'react';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import {SequenceProcessContext} from '../../context/SequenceProcessContext';


function AddStatement({ onClick }) {

  const context = useContext(SequenceProcessContext);
  const translations = context.translations;

  return (
    <div>
      <button
        type={'button'}
        className={'h5p-sequence-add'}
        onClick={onClick}
      >
        <span>
          <span className={'h5p-ri hri-pencil'} />
          <span>{translations.add}</span>
        </span>
      </button>
    </div>
  );
}

AddStatement.propTypes = {
  onClick: PropTypes.func,
};

export default AddStatement;
