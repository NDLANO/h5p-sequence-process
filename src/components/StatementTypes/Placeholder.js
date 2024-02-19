import React from 'react';
import classnames from 'classnames';
import PriorityNumber from './components/PriorityNumber.js';

const Placeholder = ({
  index,
  children,
  isDraggingOver = false,
}) => {
  return (
    <div>
      <PriorityNumber
        index={index}
      />
      <div
        className={classnames('h5p-droparea', {
          'h5p-sequence-active-droppable': isDraggingOver
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default Placeholder;
