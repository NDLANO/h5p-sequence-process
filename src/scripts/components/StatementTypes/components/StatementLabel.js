import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';

/**
 * @return {null}
 */
function StatementLabel({
  labels = [],
  selectedLabels = [],
  onLabelChange,
}) {

  const context = useContext(SequenceProcessContext);

  if (selectedLabels.length === 0) {
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
                  if (event.key === 'Enter' || event.key === ' ') {
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

export default StatementLabel;
