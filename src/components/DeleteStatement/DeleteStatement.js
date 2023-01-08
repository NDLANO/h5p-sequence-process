import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {SequenceProcessContext} from "context/SequenceProcessContext";

/**
 * @return {null}
 */
function DeleteStatement(props) {

    const context = useContext(SequenceProcessContext);

    const {
        behaviour: {
            allowAddingOfStatements = false,
        },
        translate
    } = context;

    const {
        onClick
    } = props;

    if( allowAddingOfStatements !== true){
        return null;
    }

    return (
        <button
            onClick={onClick}
            onKeyUp={event => {
                if (event.keyCode && event.keyCode === 8){
                    onClick();
                }
            }}
            className={"h5p-sequence-delete-button"}
            type={"button"}
        >
            <span
                className={"h5p-ri hri-times"}
            />
            <span className="visible-hidden">{translate('close')}</span>
        </button>
    );
}

DeleteStatement.propTypes = {
    onClick: PropTypes.func,
};

export default DeleteStatement;
