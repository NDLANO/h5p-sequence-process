import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import parse from 'html-react-parser';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';
import './Summary.css';

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

  const headerId = `${H5P.createUUID()}-summary-header`;
  const textareaId = `${H5P.createUUID()}-summary`;

  return (
    <div
      className={classnames('h5p-sequence-summary')}
      aria-labelledby={headerId}
    >
      <label
        className={'h5p-sequence-summary-header'}
        id={headerId}
        htmlFor={textareaId}
      >
        {summaryHeader ? summaryHeader : context.translate('summary')}
      </label>
      {summaryInstruction && (
        <div className={'h5p-sequence-summary-instruction'}>
          {parse(summaryInstruction)}
        </div>
      )}
      <textarea
        id={textareaId}
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
