import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {SequenceProcessContext} from 'context/SequenceProcessContext';

/**
 * @return {null}
 */
function StatementLabel(props) {

  const context = useContext(SequenceProcessContext);

  const {
    labels,
    selectedLabels,
    onLabelChange,
  } = props;

  if ( selectedLabels.length === 0) {
    return null;
  }

  return (
    <div
      className={classnames('h5p-sequence-statement-labels', {
        'hidden': selectedLabels.length === 0,
      })}
    >
      <div>
        <span
          className="h5p-ri hri-label-full"
        />
      </div>
      <div>
        {labels.filter((label) => selectedLabels.indexOf(label.id) !== -1)
          .map((label) => (
            <span
              key={label.id}
              className={'h5p-sequence-statement-label'}
            >
              {label.content}
              <button
                onClick={() => onLabelChange(label.id)}
                onKeyUp={(event) => {
                  if (event.keyCode && event.keyCode === 8) {
                    onLabelChange(label.id);
                  }
                }}
                className={'close-button'}
                type={'button'}
              >
                <div>
                  <span
                    className={'h5p-ri hri-times'}
                  />
                </div>
                <span className="visible-hidden">{context.translate('close')}</span>
              </button>
            </span>
          ))}
      </div>
    </div>
  );
}

StatementLabel.propTypes = {
  labels: PropTypes.array,
  selectedLabels: PropTypes.array,
  onLabelChange: PropTypes.func,
};

StatementLabel.defaultProps = {
  labels: [],
  selectedLabels: [],
};

export default StatementLabel;
