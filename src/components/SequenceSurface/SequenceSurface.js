import React, { useContext, useEffect, useState } from 'react';
import { SequenceProcessContext } from 'context/SequenceProcessContext';
import DraggableSequenceList from './SortableList';
import Summary from '../Summary/Summary';

function SequenceSurface() {
  const {
    registerReset,
    collectExportValues,
    behaviour,
    translate,
    translations,
    params,
  } = useContext(SequenceProcessContext);

  // State to signal reset events
  const [resetTrigger, setResetTrigger] = useState(0);

  // Mimic componentDidMount behavior
  useEffect(() => {
    // Register reset callback on mount
    registerReset(() => {
      console.log('reset requested from context');
      // Incrementing resetTrigger will signal a reset event
      setResetTrigger(prev => prev + 1);
    });
    // Empty dependency array ensures this runs only once when the component mounts
  }, [registerReset]);

  return (
    <div>
      <div className="h5p-sequence-surface">
        <DraggableSequenceList
          params={params}
          translations={translations}
          collectExportValues={collectExportValues}
          resetTrigger={resetTrigger}
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
