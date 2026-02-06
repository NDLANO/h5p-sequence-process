import React, { Fragment, useContext } from 'react';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';
import './ShowSolution.css';
import PropTypes from 'prop-types';

function ShowSolution({ showSolution }) {
  const { translate } = useContext(SequenceProcessContext);

  return (
    <Fragment>
      <button
        className={'h5p-sequence-button h5p-sequence-button-show-solution'}
        onClick={showSolution}
        type={'button'}
      >
        {translate('showSolution')}
      </button>
    </Fragment>
  );
}

ShowSolution.propTypes = {
  showSolution: PropTypes.func.isRequired,
};

export default ShowSolution;
