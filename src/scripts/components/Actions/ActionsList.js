import React from 'react';
import PropTypes from 'prop-types';
import './ActionsList.css';

const ActionsList = (
  { children }
) => {
  return (
    <div className={'h5p-sequence-actionlist'}>
      {children}
    </div>
  );
};

ActionsList.propTypes = {
  children: PropTypes.node,
};

export default ActionsList;
