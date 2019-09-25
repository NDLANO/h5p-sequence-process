import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import classsnames from 'classnames';

function StatementComment(props) {

    const inputRef = props.inputRef || useRef();

    function handleOnChange(event){
        props.onCommentChange(inputRef.current.value);
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }

    return (
        <div
            className={classsnames("h5p-sequence-statement-comment", {
                "hidden": props.show !== true
            })}
        >
            <textarea
                ref={inputRef}
                value={props.comment || ""}
                onChange={handleOnChange}
                onBlur={handleOnChange}
            />
        </div>
    )
}

StatementComment.propTypes = {
    comment: PropTypes.string,
    onCommentChange: PropTypes.func,
    inputRef: PropTypes.object,
    show: PropTypes.bool,
};

StatementComment.defaultProps = {
    show: false,
};

export default StatementComment;