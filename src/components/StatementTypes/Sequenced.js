import React from 'react';
import PropTypes from 'prop-types';

const Sequenced = props => {
    const {
        statement,
        actions
    } = props;

    return (
        <div
            className="h5p-droparea"
        >
            <div
                className="h5p-sequence-statement"
            >
                <div>
                    <div className={"h5p-sequence-drag-element"}>
                        <i className="fa fa-arrows" />
                    </div>
                    {statement}
                </div>
                {actions}
            </div>
        </div>
    );

};

Sequenced.propTypes = {
    statement: PropTypes.string,
    actions: PropTypes.object,
};

export default Sequenced;
