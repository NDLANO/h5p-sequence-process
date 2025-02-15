import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { SequenceProcessContext } from '../../context/SequenceProcessContext';
import Popover from '../Popover/Popover.js';
import classnames from 'classnames';

function Comment({
  onCommentChange,
  comment = '',
  inputRef,
  isOpen = false
}) {
  const [showPopover, setShowPopover] = useState(isOpen);
  const context = useContext(SequenceProcessContext);

  function handleToggle(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    setShowPopover(!showPopover);
    if (!showPopover) {
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    }
  }

  function handleCloseKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      handleToggle(event);
    }
  }

  return (
    <Popover
      handleClose={handleToggle}
      show={showPopover}
      classnames={context.activeBreakpoints}
      header={context.translations.feedback}
      close={context.translations.close}
      onCloseKeyDown={handleCloseKeyDown}
      popoverContent={(
        <textarea
          ref={inputRef}
          placeholder={context.translations.typeYourReasonsForSuchAnswers}
          value={comment}
          aria-label={context.translations.typeYourReasonsForSuchAnswers}
          onChange={(event) => {
            onCommentChange(event.currentTarget.value);
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
          rows={3}
        />
      )}
    >
      <button
        onClick={handleToggle}
        className={'h5p-sequence-action'}
        type={'button'}
        aria-expanded={showPopover}
        aria-haspopup="dialog"
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            handleToggle(event);
          }
        }}
      >
        <span
          className={classnames('h5p-ri', {
            'hri-comment-empty': !comment || comment.length === 0,
            'hri-comment-full': comment && comment.length > 0,
          })}
        />
        <span className="visible-hidden">{context.translations.addComment}</span>
      </button>
    </Popover>
  );
}

Comment.propTypes = {
  onCommentChange: PropTypes.func.isRequired,
  comment: PropTypes.string,
  onClick: PropTypes.func,
  inputRef: PropTypes.object,
  isOpen: PropTypes.bool,
};

export default Comment;
