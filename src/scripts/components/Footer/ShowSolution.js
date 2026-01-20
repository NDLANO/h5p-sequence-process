import React, { Fragment, useContext, useState } from 'react';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';

function ShowSolution() {

  const sequenceProcessContext = useContext(SequenceProcessContext);

  const {
    translate,
  } = sequenceProcessContext;

  return (
    <Fragment>
      <button
        className={'h5p-sequence-button-show-solution'}
        onClick={
          () => {
            console.log(sequenceProcessContext);
          }
        }
        type={'button'}
      >
        <span
          className={'h5p-ri hri-show-solution'}
        />
        {translate('showSolution')}
      </button>
    </Fragment>
  );
}

export default ShowSolution;
