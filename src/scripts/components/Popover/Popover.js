import React, { useEffect, useRef } from 'react';
import { Popover as TinyPopover, ArrowContainer } from 'react-tiny-popover';
import PropTypes from 'prop-types';
import './Popover.css';

const Popover = ({
  handleClose,
  show = false,
  children,
  popoverContent,
  classnames = [],
  header,
  close,
  align = 'end',
}) => {
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

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
      else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    if (event.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <TinyPopover
      isOpen={show}
      positions={['top', 'bottom']}
      padding={10}
      onClickOutside={handleClose} // TODO: This is unreliable!
      clickOutsideCapture={true}
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
              >
                {header}
              </div>
              <button
                ref={closeButtonRef}
                className="h5p-sequence-button close-button"
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
            <div className="h5p-sequence-popover-content">{popoverContent}</div>
          </div>
          {/* eslint-enable-next-line jsx-a11y/no-noninteractive-element-interactions */}
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
};

export default Popover;
