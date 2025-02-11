import React, { useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { SequenceProcessContext } from '../../context/SequenceProcessContext';
import Popover from '../Popover/Popover.js';
import classnames from 'classnames';

function Labels({ labels = [], onLabelChange, selectedLabelArray = [] }) {

  const [showPopover, togglePopover] = useState(selectedLabelArray.length > 0);
  const firstInputRef = useRef(null);

  const context = useContext(SequenceProcessContext);

  function handleToggle() {
    togglePopover(!showPopover);
  }

  function handleLabelKeyDown(event, labelId) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onLabelChange(labelId);
    }
  }

  function handleCloseKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  }

  return (
    <Popover
      handleClose={handleToggle}
      show={showPopover}
      classnames={context.activeBreakpoints}
      header={context.translations.selectAllLabelsConnectedToThisItem}
      close={context.translations.close}
      onCloseKeyDown={handleCloseKeyDown}
      popoverContent={(
        <div className={'h5p-sequence-label-popover'}>
          <div className={'h5p-sequence-label-list'} role="group" aria-label={context.translations.selectAllLabelsConnectedToThisItem}>
            {labels.map((label, index) => (
              <label
                key={label.id}
                className="h5p-sequence-label-item"
                tabIndex="0"
                role="checkbox"
                aria-checked={selectedLabelArray.indexOf(label.id) !== -1}
                onKeyDown={(e) => handleLabelKeyDown(e, label.id)}
              >
                <input
                  ref={index === 0 ? firstInputRef : null}
                  value={label.id}
                  type={'checkbox'}
                  checked={selectedLabelArray.indexOf(label.id) !== -1}
                  onChange={() => onLabelChange(label.id)}
                  tabIndex="-1"
                />
                <span className={classnames('h5p-ri', {
                  'hri-checked': selectedLabelArray.indexOf(label.id) !== -1,
                  'hri-unchecked': selectedLabelArray.indexOf(label.id) === -1,
                })} />
                {label.label}
              </label>
            ))}
          </div>
        </div>
      )}
    >
      <button
        onClick={handleToggle}
        className={'h5p-sequence-action'}
        type={'button'}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleToggle();
          }
        }}
      >
        <span
          className={classnames('h5p-ri', {
            'hri-label-empty': !selectedLabelArray || selectedLabelArray.length === 0,
            'hri-label-full': selectedLabelArray && selectedLabelArray.length > 0,
          })}
        />
        <span className="visible-hidden">{context.translations.addLabel}</span>
      </button>
    </Popover>
  );
}

Labels.propTypes = {
  labels: PropTypes.array,
  onLabelChange: PropTypes.func,
  selectedLabelArray: PropTypes.array,
};

export default Labels;
