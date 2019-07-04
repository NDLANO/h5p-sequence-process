import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from "react-beautiful-dnd";
import Remaining from "components/StatementTypes/Remaining";
import Sequenced from "components/StatementTypes/Sequenced";
import Placeholder from "components/StatementTypes/Placeholder";
import ActionsList from "components/Actions/ActionsList";
import Comment from "components/Actions/Comment";
import Labels from "components/Actions/Labels";

export default class StatementList extends React.Component {
    static propTypes = {
        statement: PropTypes.object,
        index: PropTypes.number.isRequired,
        draggableType: PropTypes.string.isRequired,
        isSingleColumn: PropTypes.bool,
        labels: PropTypes.array,
    };

    static defaultProps = {
        isSingleColumn: false,
        statement: {},
        labels: [],
    };

    handleStatementType() {
        const {
            statement,
            draggableType,
            isSingleColumn,
            labels,
        } = this.props;

        if (draggableType === 'remaining') {
            return (
                <Remaining
                    statement={statement.statement}
                />
            );
        } else if (draggableType === 'sequenced' && !statement.isPlaceholder) {
            let actions;
            if (isSingleColumn) {
                actions = (
                    <ActionsList>
                        {labels.length > 0 && (
                            <Labels
                                labels={labels}
                            />
                        )}
                        <Comment/>
                    </ActionsList>
                )
            }
            return (
                <Sequenced
                    statement={statement.statement}
                    actions={actions}
                />
            )
        } else if (draggableType === 'sequenced') {
            return (
                <Placeholder
                    statement={statement}
                />
            );
        }
    }

    render() {
        const {
            index,
            statement,
            draggableType,
        } = this.props;

        return (
            <Draggable
                draggableId={draggableType + "-" + statement.id}
                index={index}
            >
                {provided => (
                    <div
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                    >
                        {this.handleStatementType()}
                    </div>
                )}
            </Draggable>
        )
    }
}