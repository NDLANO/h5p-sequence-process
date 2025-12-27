import React, { Fragment, useContext, useState } from 'react';
import Popover from '@components/Popover/Popover.js';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';

import './Reset.css';

function Reset() {

  const [showPopover, setPopover] = useState(false);
  const sequenceProcessContext = useContext(SequenceProcessContext);

  const {
    behaviour: {
      enableRetry = false
    },
    translate,
    reset,
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
          close={translate('close')}
          header={translate('restart')}
          align={'start'}
          popoverContent={(
            <div
              role={'dialog'}
              className={'h5p-sequence-reset-modal'}
            >
              <div>
                {translate('ifYouContinueAllYourChangesWillBeLost')}
              </div>
              <div className={'h5p-sequence-reset-modal-buttons'}>
                <button
                  onClick={confirmReset}
                  className={'h5p-sequence-button continue'}
                  type={'button'}
                >
                  {translate('continue')}
                </button>
                <button
                  onClick={togglePopover}
                  className={'cancel'}
                  type={'button'}
                >
                  {translate('cancel')}
                </button>
              </div>
            </div>
          )}
        >
          <button
            className={'h5p-sequence-button h5p-sequence-button-restart'}
            onClick={togglePopover}
            type={'button'}
          >
            <span
              className={'h5p-ri hri-restart'}
            />
            {translate('restart')}
          </button>
        </Popover>
      )}
    </Fragment>
  );
}

export default Reset;
