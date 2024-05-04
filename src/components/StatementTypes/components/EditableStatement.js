import React, {useState, useRef} from 'react';
import PropsTypes from 'prop-types';
import classnames from 'classnames';
import {debounce} from '../../utils';

function EditableStatement(props) {

  const [inEditMode, toggleEditMode] = useState(props.inEditMode);

  const inputRef = useRef();

  const handleClick = () => {
    if (inEditMode === false) {
      toggleEditMode(true);
      inputRef.current.value = props.statement;
      setTimeout(() => inputRef.current.focus(), 0);
    }
  };

  const handleBlur = () => {
    toggleEditMode(false);
  };

  const handleKeyUp = (event) => {
    if (event.keyCode === 13) {
      if ( inEditMode ) {
        handleBlur();
      }
      else {
        handleClick();
      }
    }
  };

  const id = 'es_' + props.idBase;
  const labelId = 'label_' + id;
  const inputId = 'input_' + id;

  /*
   * TODO: Clean this up. This feels like a very weird construct. Why can't
   *       the `input` element be used on its own? Why the textbox wrapper that
   *       adds an extra level while there already is an input field? Also, why
   *       is ARIA labelling handled that way?
   */
  return (
    <div
      role={'textbox'}
      tabIndex={0}
      onClick={handleClick}
      className={'h5p-sequence-editable-container'}
      onKeyUp={handleKeyUp}
      aria-labelledby={labelId}
    >
      <div>
        <label
          title={props.statement}
          htmlFor={inputId}
          id={labelId}
        >
          <span className={'visible-hidden'}>Statement</span>
          <input
            className={classnames('h5p-sequence-editable', {
              'hidden': inEditMode === false,
            })}
            ref={inputRef}
            onBlur={handleBlur}
            onChange={debounce(() => props.onBlur(inputRef.current.value), 200)}
            aria-label={'Edit statement ' + props.statement}
            id={inputId}
          />
        </label>
        <p
          className={classnames('h5p-sequence-noneditable', {
            'hidden': inEditMode === true,
          })}
          data-no-dnd="true"
        >
          {props.statement}
        </p>
      </div>
    </div>
  );
}

EditableStatement.propTypes = {
  statement: PropsTypes.string,
  inEditMode: PropsTypes.bool,
  onBlur: PropsTypes.func,
  idBase: PropsTypes.oneOfType([
    PropsTypes.string,
    PropsTypes.number,
  ]),
};

EditableStatement.defaultProps = {
  inEditMode: false,
};

export default EditableStatement;
