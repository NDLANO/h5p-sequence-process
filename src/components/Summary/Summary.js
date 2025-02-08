import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import parse from 'html-react-parser';

function Summary(props) {

  const [comment, setComment] = useState('');

  const {
    reset,
    exportValues,
    translate,
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
        <div>{summaryHeader ? summaryHeader : translate('summary')}</div>
      </label>
      {summaryInstruction && (
        <div>{parse(summaryInstruction)}</div>
      )}
      <textarea
        id={'summary'}
        placeholder={translate('giveABriefSummary')}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        aria-label={translate('giveABriefSummary')}
      />
    </div>
  );
}

Summary.propTypes = {
  reset: PropTypes.func,
  exportValues: PropTypes.func,
  translate: PropTypes.func,
  summaryHeader: PropTypes.string,
  summaryInstruction: PropTypes.string,
};

export default Summary;
