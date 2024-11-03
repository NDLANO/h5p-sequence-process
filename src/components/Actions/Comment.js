import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import {SequenceProcessContext} from '../../context/SequenceProcessContext';
import Popover from '../Popover/Popover';
import classnames from 'classnames';

function Comment(props) {

  const [comment, setComment] = useState(props.comment);

  const context = useContext(SequenceProcessContext);

  function handleToggle() {
    if ( props.onClick ) {
      return props.onClick();
    }
    if ( !props.isOpen ) {
      setComment(props.comment || '');
      setTimeout(() => props.inputRef.current && props.inputRef.current.focus(), 0);
    }
    else {
      props.onCommentChange(comment);
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
          value={comment}
          aria-label={context.translations.typeYourReasonsForSuchAnswers}
          onChange={(event) => setComment(event.currentTarget.value)}
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
  onCommentChange: PropTypes.func,
  comment: PropTypes.string,
  onClick: PropTypes.func,
  inputRef: PropTypes.object,
  isOpen: PropTypes.bool,
};

export default Comment;
