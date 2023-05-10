import React, {Fragment, useContext, useState} from 'react';
import Popover from '../Popover/Popover';
import {SequenceProcessContext} from 'context/SequenceProcessContext';

function Reset() {

  const [showPopover, setPopover] = useState(false);
  const sequenceProcessContext = useContext(SequenceProcessContext);

  const {
    behaviour: {
      enableRetry = false
    },
    reset,
    translations
  } = sequenceProcessContext;

  function togglePopover() {
    setPopover(!showPopover);
  }

  function confirmReset() {
    reset();
    togglePopover();
  }

  return (
    <Fragment>
      {enableRetry === true && (
        <Popover
          handleClose={togglePopover}
          show={showPopover}
          classnames={sequenceProcessContext.activeBreakpoints}
          close={translations.close}
          header={translations.restart}
          align={'start'}
          popoverContent={(
            <div
              role={'dialog'}
              className={'h5p-sequence-reset-modal'}
            >
              <div>
                {translations.ifYouContinueAllYourChangesWillBeLost}
              </div>
              <div>
                <button
                  onClick={confirmReset}
                  className={'continue'}
                  type={'button'}
                >
                  {translations.continue}
                </button>
                <button
                  onClick={togglePopover}
                  className={'cancel'}
                  type={'button'}
                >
                  {translations.cancel}
                </button>
              </div>
            </div>
          )}
        >
          <button
            className={'h5p-sequence-button-restart'}
            onClick={togglePopover}
            type={'button'}
          >
            <span
              className={'h5p-ri hri-restart'}
            />
            {translations.restart}
          </button>
        </Popover>
      )}
    </Fragment>
  );
}

export default Reset;
