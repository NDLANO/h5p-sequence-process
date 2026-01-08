import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';
import Popover from '@components/Popover/Popover.js';
import classnames from 'classnames';

import './Comment.css';

const Comment = ({
  onCommentChange,
  comment = '',
  inputRef,
  isOpen = false
}) => {
  const [showPopover, setShowPopover] = useState(isOpen);
  const context = useContext(SequenceProcessContext);

  const handleToggle = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    setShowPopover(!showPopover);
    if (!showPopover) {
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    }
  };

  const handleCloseKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      handleToggle(event);
    }
  };

  return (
    <Popover
      handleClose={handleToggle}
      show={showPopover}
      classnames={context.activeBreakpoints}
      header={context.translate('feedback')}
      close={context.translate('close')}
      onCloseKeyDown={handleCloseKeyDown}
      popoverContent={(
        <textarea
          className="h5p-sequence-statement-comment"
          ref={inputRef}
          placeholder={context.translate('typeYourReasonsForSuchAnswers')}
          value={comment}
          aria-label={context.translate('typeYourReasonsForSuchAnswers')}
          onChange={(event) => {
            onCommentChange(event.currentTarget.value);
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Tab') {
              event.stopPropagation();
            }
          }}
          rows={3}
        />
      )}
    >
      <button
        onClick={handleToggle}
        className={classnames('h5p-sequence-action-button comment', {
          'empty': !comment || comment.length === 0,
          'full': comment && comment.length > 0,
        })}
        type={'button'}
        aria-expanded={showPopover}
        aria-label={context.translate('addComment')}
        aria-haspopup="dialog"
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            handleToggle(event);
          }
        }}
      >
      </button>
    </Popover>
  );
};

Comment.propTypes = {
  onCommentChange: PropTypes.func.isRequired,
  comment: PropTypes.string,
  onClick: PropTypes.func,
  inputRef: PropTypes.object,
  isOpen: PropTypes.bool,
};

export default Comment;
