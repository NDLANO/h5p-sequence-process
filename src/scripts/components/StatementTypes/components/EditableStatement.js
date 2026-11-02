import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { debounce } from '@services/utils.js';

/** @constant {number} CHANGE_TIMEOUT_MS Delay to react to change event. */
const CHANGE_TIMEOUT_MS = 200;

import './EditableStatement.css';

const EditableStatement = forwardRef((props, ref) => {
  const { statement, onBlur, idBase = false, isTabbable = false, disabled = false, clearOnEdit = false } = props;
  const [inEditMode, toggleEditMode] = useState(false);
  const inputRef = useRef();
  const editStartRef = useRef({ cleared: false, original: '' });

  const handleClick = () => {
    if (disabled) {
      return;
    }

    toggleEditMode(true);
    editStartRef.current = {
      cleared: clearOnEdit,
      original: statement,
    };

    // On first edit, start with empty field so user writes their own version; otherwise keep the text.
    inputRef.current.value = clearOnEdit ? '' : statement;
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

    const { cleared, original } = editStartRef.current;
    const value = inputRef.current?.value;

    if (cleared && value === '') {
      // First edit of author-defined statement was left empty: restore original text instead of saving empty statement
      if (inputRef.current) {
        inputRef.current.value = original;
      }
      return;
    }

    onBlur(value);
  };

  const handleKeyDown = (event) => {
    if (disabled) {
      return;
    }

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
    if (disabled) {
      return;
    }

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

  const pRef = useRef();
  useEffect(() => {
    if (pRef.current) {
      const tooltip = H5P?.Tooltip(pRef.current);

      return () => {
        tooltip.remove();
      };
    }
  }, []);

  return (
    <div
      role="textbox"
      tabIndex={isTabbable && !inEditMode && !disabled ? '0' : '-1'}
      onClick={handleClick}
      className="h5p-sequence-editable-container"
      onKeyDown={handleKeyDown}
      aria-labelledby={labelId}
      aria-disabled={disabled}
    >
      <label
        title={statement}
        htmlFor={inputId}
        id={labelId}
      >
        <span className="h5p-sequence-editable-label-hidden">Statement</span>
        <input
          type="text"
          className={classnames('h5p-sequence-editable', {
            hidden: !inEditMode,
          })}
          ref={inputRef}
          defaultValue={statement}
          onBlur={handleBlur}
          onChange={debounce(() => {
            if (editStartRef.current.cleared) {
              return;
            }
            onBlur(inputRef.current.value);
          }, CHANGE_TIMEOUT_MS)}
          aria-label={'Edit statement ' + statement}
          id={inputId}
          tabIndex={isTabbable && inEditMode ? '0' : '-1'}
          onKeyDown={handleInputKeyDown}
        />
      </label>
      <p
        ref={pRef}
        className={classnames('h5p-sequence-noneditable', {
          hidden: inEditMode,
        })}
        aria-label={statement}
        data-no-dnd="true"
      >
        {statement}
      </p>
    </div>
  );
});

EditableStatement.displayName = 'EditableStatement';

EditableStatement.propTypes = {
  statement: PropTypes.string,
  onBlur: PropTypes.func,
  clearOnEdit: PropTypes.bool,
  idBase: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  isTabbable: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default EditableStatement;
