import React from 'react';
import PropTypes from 'prop-types';
import DragArrows from "./components/DragArrows";

const Remaining = props => {
    const {
        statement
    } = props;

    return (
        <div
            className="h5p-sequence-statement"
        >
            <div>
                <DragArrows />
                {statement}
            </div>
        </div>
    );

};

Remaining.propTypes = {
    statement: PropTypes.string,
};

export default Remaining;
