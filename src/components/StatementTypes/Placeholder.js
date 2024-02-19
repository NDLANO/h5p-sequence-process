import React from 'react';
import classnames from 'classnames';

const Placeholder = ({
  children,
  isDraggingOver = false,
}) => {
  return (
    <div>
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
