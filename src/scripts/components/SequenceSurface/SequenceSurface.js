import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';
import SortableList from './SortableList.js';
import './SequenceSurface.css';

const SequenceSurface = ({ disabled }) => {
  const {
    registerReset,
    collectExportValues,
    params,
  } = useContext(SequenceProcessContext);

  return (
    <div>
      <div
        className="h5p-sequence-surface"
        role="application" // Required to bring NDVA into focus mode, otherwise keyboard navigation does not work
      >
        <SortableList
          params={params}
          collectExportValues={collectExportValues}
          reset={registerReset}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

SequenceSurface.propTypes = {
  disabled: PropTypes.bool,
};

export default SequenceSurface;
