import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from "react-beautiful-dnd";

export default class StatementList extends React.Component {

    static propTypes = {
        statements: PropTypes.array,
    };

    static defaultProps = {
        statements: [],
    };

    render() {
        const {
            statements,
        } = this.props;

        return (
            <Fragment>
                {statements.map((statement, index) => {
                    return (
                        <Draggable
                            draggableId={statement.id}
                            index={index}
                        >
                            {provided => (
                                <div
                                    className="h5p-droparea"
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                >
                                    <div
                                        className={!isPlaceholder ? "h5p-sequence-statement" : ""}
                                    >
                                        {label}
                                    </div>
                                </div>
                            )}
                        </Draggable>
                    );
                })}
            </Fragment>
        );
    }
}