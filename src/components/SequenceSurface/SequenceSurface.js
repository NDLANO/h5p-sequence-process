import React, { useContext } from 'react';
import { SequenceProcessContext } from './../../context/SequenceProcessContext.js';
import SortableList from './SortableList.js';
import Summary from '../Summary/Summary.js';

function SequenceSurface() {
  const {
    registerReset,
    collectExportValues,
    behaviour,
    params,
  } = useContext(SequenceProcessContext);

  return (
    <div>
      <div className="h5p-sequence-surface">
        <SortableList
          params={params}
          collectExportValues={collectExportValues}
          reset={registerReset}
        />
      </div>
      {behaviour.provideSummary === true && (
        <Summary
          reset={registerReset}
          exportValues={collectExportValues}
          summaryHeader={params.summaryHeader}
          summaryInstruction={params.summaryInstruction}
        />
      )}
    </div>
  );
}

export default SequenceSurface;
