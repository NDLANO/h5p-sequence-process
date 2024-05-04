import React, { useEffect, useRef } from 'react';
import { Popover as TinyPopover, ArrowContainer } from 'react-tiny-popover';
import PropTypes from 'prop-types';

const Popover = ({ handleClose, show, children, popoverContent, classnames = [], header, close, align = 'end' }) => {
  // Use useRef to avoid re-creating the classnames array on every render
  const classnamesRef = useRef([...classnames, 'h5p-sequence-popover']);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (show && popoverRef.current) {
      popoverRef.current.focus();
    }
  }, [show]);

  
  return (
    <TinyPopover
      isOpen={show}
      positions={['top', 'bottom']}
      padding={10}
      onClickOutside={handleClose}
      align={align}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor="white"
          arrowSize={10}
          className="popover-arrow-container"
        >
          <div className="h5p-sequence-popover-container" role="dialog" aria-modal="true" tabIndex="-1" ref={popoverRef}>
            <div className="h5p-sequence-popover-header">
              <div>{header}</div>
              <button onClick={handleClose} className="close-button" type="button">
                <span className="h5p-ri hri-close" />
                <span className="visible-hidden">{close}</span>
              </button>
            </div>
            <div className="h5p-sequence-popover-content">
              {popoverContent}
            </div>
          </div>
        </ArrowContainer>
      )}
      containerClassName={classnamesRef.current.join(' ')}
      containerStyle={{ overflow: 'unset' }}
    >
      {children}
    </TinyPopover>
  );
};

Popover.propTypes = {
  handleClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  popoverContent: PropTypes.node, // Changed from object to node to accommodate any type of React node
  classnames: PropTypes.arrayOf(PropTypes.string),
  header: PropTypes.string,
  close: PropTypes.string,
  align: PropTypes.oneOf(['start', 'center', 'end']), // Define possible values for align prop
};

export default Popover;
