import React from 'react';
import PropTypes from 'prop-types';

export default class Sequenced extends React.Component {

    static propTypes = {
        provided: PropTypes.object,
        statement: PropTypes.object,
    };

    render() {
        const {
            provided,
            statement
        } = this.props;

        return (
            <div
                className="h5p-droparea"
                ref={provided.innerRef}
                {...provided.dragHandleProps}
                {...provided.draggableProps}
            >
                <div
                    className="h5p-sequence-statement"
                >
                    {statement.statement}
                </div>
            </div>
        );
    }
}