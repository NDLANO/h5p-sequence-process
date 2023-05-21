import React, {useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import classsnames from 'classnames';
import {SequenceProcessContext} from 'context/SequenceProcessContext';

/**
 * @return {null}
 */
function StatementComment(props) {

  const context = useContext(SequenceProcessContext);
  const inputRef = props.inputRef || useRef();

  function handleOnChange() {
    props.onCommentChange(inputRef.current.value);
    inputRef.current.style.height = 'auto';
    inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
  }

  if ( props.show !== true) {
    return null;
  }

  return (
    <div
      className={classsnames('h5p-sequence-statement-comment', {
        'hidden': props.show !== true
      })}
    >
      <div>
        <span
          className="h5p-ri hri-comment-full"
        />
      </div>
      <div>
        <textarea
          ref={inputRef}
          value={props.comment || ''}
          onChange={handleOnChange}
          onBlur={handleOnChange}
          placeholder={context.translations.typeYourReasonsForSuchAnswers}
          aria-label={context.translations.typeYourReasonsForSuchAnswers}
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

StatementComment.defaultProps = {
  show: false,
};

export default StatementComment;
