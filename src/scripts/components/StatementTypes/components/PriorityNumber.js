import React from 'react';
import PropTypes from 'prop-types';

import './PriorityNumber.css';

/**
 * Container with number indicating what priority a statement has.
 * @param {object} props React props.
 * @returns {object} JSX element.
 */
const PriorityNumber = (props) => {
  const { index } = props;

  return (
    <div className={'h5p-order-priority-number'}>
      <div className={'h5p-order-priority-number-circle h5p-order-priority-number-' + (index + 1)}>{index + 1}</div>
    </div>
  );
};

PriorityNumber.propTypes = {
  index: PropTypes.number,
};

export default PriorityNumber;
