import React, { useEffect, useRef } from 'react';
import { Popover as TinyPopover, ArrowContainer } from 'react-tiny-popover';
import PropTypes from 'prop-types';

const Popover = ({ handleClose, show, children, popoverContent, classnames = [], header, close, align = 'end', onCloseKeyDown = () => { } }) => {
  const classnamesRef = useRef([...classnames, 'h5p-sequence-popover']);
  const popoverRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (show && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [show]);

  // Trap focus within the popover and handle Escape key
  const handleKeyDown = (event) => {
    if (!show) return;

    const focusableElements = popoverRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Handle Tab key for focus trapping
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    // Handle Escape key to close the popover
    if (event.key === 'Escape') {
      handleClose();
    }
  };

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
          <div
            className="h5p-sequence-popover-container"
            role="dialog"
            aria-modal="true"
            ref={popoverRef}
            onKeyDown={handleKeyDown}
          >
            <div className="h5p-sequence-popover-header">
              <div
                role="heading"
                aria-level="2"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    event.stopPropagation();
                    handleClose();
                  }
                }}
              >
                {header}
              </div>
              <button
                ref={closeButtonRef}
                className="close-button"
                type="button"
                onClick={handleClose}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === 'Escape' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    handleClose();
                  }
                }}
                aria-label={close}
              >
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
  children: PropTypes.node,
  popoverContent: PropTypes.node,
  classnames: PropTypes.arrayOf(PropTypes.string),
  header: PropTypes.string,
  close: PropTypes.string,
  align: PropTypes.oneOf(['start', 'center', 'end']),
  onCloseKeyDown: PropTypes.func,
};

Popover.defaultProps = {
  show: false,
  classnames: [],
  align: 'end',
  onCloseKeyDown: () => { },
};

export default Popover;
