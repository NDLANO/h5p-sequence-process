import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './UnEditableStatement.css';

const UnEditableStatement = (props) => {
  const elementRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    let tooltip;
    if (elementRef.current && H5P?.Tooltip && !props.hideTooltip) {
      tooltip = H5P.Tooltip(elementRef.current);
    }

    return () => {
      if (tooltip?.remove) {
        tooltip.remove();
      }
    };
  }, [props.hideTooltip, props.statement]);

  return (
    <div className={'h5p-sequence-element'} ref={elementRef} aria-label={props.statement}>
      <div className={'h5p-sequence-element-text'} ref={textRef}>
        {props.statement}
      </div>
    </div>
  );
};

UnEditableStatement.propTypes = {
  statement: PropTypes.string,
  hideTooltip: PropTypes.bool,
};

export default UnEditableStatement;
