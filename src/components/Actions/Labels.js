import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import { SequenceProcessContext } from '../../context/SequenceProcessContext';
import Popover from '../Popover/Popover.js';
import classnames from 'classnames';

function Labels(props) {

  const [showPopover, togglePopover] = useState(props.selectedLabelArray.length > 0);

  const context = useContext(SequenceProcessContext);

  function handleToggle() {
    togglePopover(!showPopover);
  }

  const {
    labels,
    selectedLabelArray,
    onLabelChange,
  } = props;

  return (
    <Popover
      handleClose={handleToggle}
      show={showPopover}
      classnames={context.activeBreakpoints}
      header={context.translations.selectAllLabelsConnectedToThisItem}
      close={context.translations.close}
      popoverContent={(
        <div className={'h5p-sequence-label-popover'}>
          <div className={'h5p-sequence-label-list'}>
            {labels.map((label) => (
              <label
                key={label.id}
              >
                <input
                  value={label.id}
                  type={'checkbox'}
                  checked={selectedLabelArray.indexOf(label.id) !== -1}
                  onChange={() => onLabelChange(label.id)}
                />
                <span className={classnames('h5p-ri', {
                  'hri-checked': selectedLabelArray.indexOf(label.id) !== -1,
                  'hri-unchecked': selectedLabelArray.indexOf(label.id) === -1,
                })} />
                {label.content}
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
          if (event.keyCode === 13) {
            handleToggle();
          }
        }}
      >
        <span
          className={classnames('h5p-ri', {
            'hri-label-empty': !props.selectedLabelArray || props.selectedLabelArray.length === 0,
            'hri-label-full': props.selectedLabelArray && props.selectedLabelArray.length > 0,
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

Labels.defaultProps = {
  labels: [],
  selectedLabelArray: [],
};

export default Labels;
