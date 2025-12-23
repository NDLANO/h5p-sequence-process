import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import parse from 'html-react-parser';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';

function Summary(props) {
  const context = useContext(SequenceProcessContext);

  const [comment, setComment] = useState('');

  const {
    reset,
    exportValues,
    summaryHeader,
    summaryInstruction,
  } = props;

  exportValues('summary', () => comment);
  reset(() => setComment(''));

  return (
    <div
      className={classnames('h5p-sequence-summary')}
      aria-labelledby={'summary-header'}
    >
      <label
        id={'summary-header'}
        htmlFor={'summary'}
      >
        <div>{summaryHeader ? summaryHeader : context.translate('summary')}</div>
      </label>
      {summaryInstruction && (
        <div>{parse(summaryInstruction)}</div>
      )}
      <textarea
        id={'summary'}
        placeholder={context.translate('giveABriefSummary')}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        aria-label={context.translate('giveABriefSummary')}
      />
    </div>
  );
}

Summary.propTypes = {
  reset: PropTypes.func,
  exportValues: PropTypes.func,
  summaryHeader: PropTypes.string,
  summaryInstruction: PropTypes.string,
};

export default Summary;
