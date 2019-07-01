import React from 'react';
import PropTypes from 'prop-types';

export default class Remaining extends React.Component {

    static propTypes = {
        provided: PropTypes.object,
        statement: PropTypes.object,
    };

    render() {
        const {
            provided
        } = this.props;

        return (
            <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                className="h5p-sequence-statement"
            >
                {statement.statement}
            </div>
        );
    }
}