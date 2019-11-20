import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

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
            aria-labelledby={"summary-header"}
        >
            <label
                id={"summary-header"}
                htmlFor={'summary'}
            >
                <h2>{summaryHeader ? summaryHeader : translate('summary')}</h2>
            </label>
            {summaryInstruction && (
                <p>{summaryInstruction}</p>
            )}
            <textarea
                id={"summary"}
                placeholder={translate('typeYourReasonsForSuchAnswers')}
                value={comment}
                onChange={event => setComment(event.target.value)}
                aria-label={translate('typeYourReasonsForSuchAnswers')}
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
