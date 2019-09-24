import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import {SequenceProcessContext} from "../../context/SequenceProcessContext";
import Popover from "../Popover/Popover";
import classnames from 'classnames';

function Comment(props) {

    const [showPopover, togglePopover] = useState(false);
    const [comment, setComment] = useState(props.comment);

    const context = useContext(SequenceProcessContext);

    function handleToggle() {
        if( props.onClick ){
            return props.onClick();
        }
        if( !showPopover){
            setComment(props.comment || "");
        } else {
            props.onCommentChange(comment);
        }
        togglePopover(!showPopover);
    }

    return (
        <Popover
            handleClose={handleToggle}
            show={showPopover}
            popoverContent={(
                <textarea
                    placeholder={context.translations.typeYourReasonsForSuchAnswers}
                    value={comment}
                    onChange={event => setComment(event.currentTarget.value)}
                />
            )}
        >
            <button
                onClick={handleToggle}
                className={classnames("h5p-sequence-action", {
                    'h5p-sequence-action-active': props.comment && props.comment.length > 0,
                })}
                onKeyDown={event => {
                    if(event.keyCode === 13){
                        handleToggle();
                    }
                }}
            >
                <i
                    className={"fa fa-commenting-o"}
                />
            </button>
        </Popover>
    );
}

Comment.propTypes = {
    onCommentChange: PropTypes.func,
    comment: PropTypes.string,
    onClick: PropTypes.func,
};

export default Comment;
