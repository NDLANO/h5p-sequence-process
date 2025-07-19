import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { debounce } from '../../utils';

const EditableStatement = forwardRef(({ statement, onBlur, idBase = false }, ref) => {
  const [inEditMode, toggleEditMode] = useState(false);
  const inputRef = useRef();

  const handleClick = () => {
    toggleEditMode(true);
    inputRef.current.value = statement;
    setTimeout(() => {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  useImperativeHandle(ref, () => ({
    enterEditMode: () => {
      handleClick();
    },
    inputRef: inputRef
  }));

  const handleBlur = () => {
    toggleEditMode(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!inEditMode) {
        handleClick();
        setTimeout(() => {
          const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
          inputRef.current.dispatchEvent(enterEvent);
        }, 50);
      }
    }
    else if ((event.key === ' ' || event.key === 'Spacebar') && !inEditMode) {
      event.preventDefault();
      handleClick();
    }
  };

  const handleInputKeyDown = (event) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
      // Only stop propagation, don't prevent default
      event.stopPropagation();
    }
    else if (event.key === 'Escape') {
      handleBlur();
    }
  };

  const id = 'es_' + idBase;
  const labelId = 'label_' + id;
  const inputId = 'input_' + id;

  return (
    <div
      role="textbox"
      tabIndex={inEditMode ? -1 : 0}
      onClick={handleClick}
      className="h5p-sequence-editable-container"
      onKeyDown={handleKeyDown}
      aria-labelledby={labelId}
    >
      <div>
        <label
          title={statement}
          htmlFor={inputId}
          id={labelId}
        >
          <span className="visible-hidden">Statement</span>
          <input
            type="text"
            className={classnames('h5p-sequence-editable', {
              hidden: !inEditMode,
            })}
            ref={inputRef}
            defaultValue={statement}
            onBlur={handleBlur}
            onChange={debounce(() => onBlur(inputRef.current.value), 200)}
            aria-label={'Edit statement ' + statement}
            id={inputId}
            tabIndex={inEditMode ? 0 : -1}
            onKeyDown={handleInputKeyDown}
          />
        </label>
        <p
          className={classnames('h5p-sequence-noneditable', {
            hidden: inEditMode,
          })}
          data-no-dnd="true"
        >
          {statement}
        </p>
      </div>
    </div>
  );
});

EditableStatement.displayName = 'EditableStatement';

EditableStatement.propTypes = {
  statement: PropTypes.string,
  onBlur: PropTypes.func,
  idBase: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default EditableStatement;
