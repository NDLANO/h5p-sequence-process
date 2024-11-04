import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {SequenceProcessContext} from '../../context/SequenceProcessContext';
import Popover from '../Popover/Popover';
import classnames from 'classnames';

function Comment(props) {
  const context = useContext(SequenceProcessContext);

  function handleToggle() {
    if (props.onClick) {
      return props.onClick();
    }
    if (!props.isOpen) {
      setTimeout(() => props.inputRef.current && props.inputRef.current.focus(), 0);
    }
  }

  return (
    <Popover
      handleClose={handleToggle}
      show={props.isOpen}
      classnames={context.activeBreakpoints}
      header={context.translations.feedback}
      close={context.translations.close}
      popoverContent={(
        <textarea
          ref={props.inputRef}
          placeholder={context.translations.typeYourReasonsForSuchAnswers}
          value={props.comment || ''}
          aria-label={context.translations.typeYourReasonsForSuchAnswers}
          onChange={(event) => props.onCommentChange(event.currentTarget.value)}
          rows={3}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        />
      )}
    >
      <button
        onClick={handleToggle}
        className={'h5p-sequence-action'}
        type={'button'}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            handleToggle();
          }
        }}
      >
        <span
          className={classnames('h5p-ri', {
            'hri-comment-empty': !props.comment || props.comment.length === 0,
            'hri-comment-full': props.comment && props.comment.length > 0,
          })}
        />
        <span className="visible-hidden">{context.translations.addComment}</span>
      </button>
    </Popover>
  );
}

Comment.propTypes = {
  onCommentChange: PropTypes.func,
  comment: PropTypes.string,
  onClick: PropTypes.func,
  inputRef: PropTypes.object,
  isOpen: PropTypes.bool,
};

export default Comment;
