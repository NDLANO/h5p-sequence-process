import React, { useContext } from 'react';
import { SequenceProcessContext } from 'context/SequenceProcessContext';
import SortableList from './SortableList';
import Summary from '../Summary/Summary';

function SequenceSurface() {
  const {
    registerReset,
    collectExportValues,
    behaviour,
    translate,
    params,
  } = useContext(SequenceProcessContext);

  return (
    <div>
      <div className="h5p-sequence-surface">
        <SortableList
          params={params}
          translate={translate}
          collectExportValues={collectExportValues}
          reset={registerReset}
        />
      </div>
      {behaviour.provideSummary === true && (
        <Summary
          reset={registerReset}
          exportValues={collectExportValues}
          translate={translate}
          summaryHeader={params.summaryHeader}
          summaryInstruction={params.summaryInstruction}
        />
      )}
    </div>
  );
}

export default SequenceSurface;
