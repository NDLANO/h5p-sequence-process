import React, { useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';

/**
 * @return {null}
 */
function StatementComment({
  comment,
  onCommentChange,
  inputRef: externalInputRef,
  show = false,
}) {
  const context = useContext(SequenceProcessContext);
  const inputRef = externalInputRef || useRef();

  function handleOnChange() {
    onCommentChange(inputRef.current.value);
    inputRef.current.style.height = 'auto';
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
  }

  if (show !== true) {
    return null;
  }

  return (
    <div
      className={classnames('h5p-sequence-statement-comment', {
        hidden: show !== true,
      })}
    >
      <div>
        <span className="h5p-ri hri-comment-full" />
      </div>
      <div>
        <textarea
          ref={inputRef}
          value={comment || ''}
          onChange={handleOnChange}
          onBlur={handleOnChange}
          placeholder={context.translate('typeYourReasonsForSuchAnswers')}
          aria-label={context.translate('typeYourReasonsForSuchAnswers')}
        />
      </div>
    </div>
  );
}

StatementComment.propTypes = {
  comment: PropTypes.string,
  onCommentChange: PropTypes.func,
  inputRef: PropTypes.object,
  show: PropTypes.bool,
};

export default StatementComment;
