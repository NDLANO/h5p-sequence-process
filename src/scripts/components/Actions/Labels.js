import React, { useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';
import Popover from '@components/Popover/Popover.js';
import classnames from 'classnames';

import './Labels.css';

const Labels = ({ labels = [], onLabelChange, selectedLabelArray = [] }) => {

  const [showPopover, togglePopover] = useState(selectedLabelArray.length > 0);
  const firstInputRef = useRef(null);

  const context = useContext(SequenceProcessContext);
  const checkboxId = H5P.createUUID();

  const handleToggle = () => {
    togglePopover(!showPopover);
  };

  const handleLabelKeyDown = (event, labelId) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onLabelChange(labelId);
    }
  };

  const handleCloseKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <Popover
      parentElement={context.wrapper}
      handleClose={handleToggle}
      show={showPopover}
      classnames={context.activeBreakpoints}
      header={context.translate('selectAllLabelsConnectedToThisItem')}
      close={context.translate('close')}
      onCloseKeyDown={handleCloseKeyDown}
      popoverContent={(
        <div className={'h5p-sequence-label-popover'}>
          <div
            className={'h5p-sequence-label-list'}
            role="group"
            aria-label={context.translate('selectAllLabelsConnectedToThisItem')}
          >
            {labels.map((label, index) => (
              <div
                key={label.id}
                className="h5p-sequence-label-item"
                onKeyDown={(e) => handleLabelKeyDown(e, label.id)}
              >
                <input
                  id={checkboxId}
                  ref={index === 0 ? firstInputRef : null}
                  value={label.id}
                  type={'checkbox'}
                  checked={selectedLabelArray.indexOf(label.id) !== -1}
                  onChange={() => onLabelChange(label.id)}
                />
                <label htmlFor={checkboxId}>{label.label}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    >
      <button
        onClick={handleToggle}
        className={classnames('h5p-sequence-action-button label', {
          'empty': !selectedLabelArray || selectedLabelArray.length === 0,
          'full': selectedLabelArray && selectedLabelArray.length > 0,
        })}
        type={'button'}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleToggle();
          }
        }}
        aria-label={context.translate('addLabel')}
      >
      </button>
    </Popover>
  );
};

Labels.propTypes = {
  labels: PropTypes.array,
  onLabelChange: PropTypes.func,
  selectedLabelArray: PropTypes.array,
};

export default Labels;
