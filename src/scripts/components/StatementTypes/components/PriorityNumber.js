import React from 'react';
import PropTypes from 'prop-types';
import { computeFocusColor } from '@services/utils.js';

import './PriorityNumber.css';

/**
 * Container with enumeration indicating what priority a statement has.
 * @param {object} props React props.
 * @returns {object} JSX element.
 */
const PriorityNumber = (props) => {
  const { enumeration, hidden, backgroundColor } = props;
  const focusColor = computeFocusColor(backgroundColor);

  return (
    <div className={'h5p-order-priority-number'}>
      <div
        className={`h5p-order-priority-number-circle ${hidden === true ? 'hidden' : ''}`}
        style={{ '--backgroundColor': backgroundColor, '--focusColor': focusColor }}
      >
        {enumeration ?? ''}
      </div>
    </div>
  );
};

PriorityNumber.propTypes = {
  enumeration: PropTypes.string,
  hidden: PropTypes.bool,
  backgroundColor: PropTypes.string,
};

export default PriorityNumber;
