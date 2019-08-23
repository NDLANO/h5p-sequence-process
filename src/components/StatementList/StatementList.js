import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from "react-beautiful-dnd";
import Remaining from "../StatementTypes/Remaining";
import Sequenced from "../StatementTypes/Sequenced";
import Placeholder from "../StatementTypes/Placeholder";
import ActionsList from "../Actions/ActionsList";
import Comment from "../Actions/Comment";
import Labels from "../Actions/Labels";

export default class StatementList extends React.Component {
    static propTypes = {
        statement: PropTypes.object,
        index: PropTypes.number.isRequired,
        draggableType: PropTypes.string.isRequired,
        isSingleColumn: PropTypes.bool,
        labels: PropTypes.array,
        onStatementChange: PropTypes.func,
        selectedLabels: PropTypes.array,
    };

    static defaultProps = {
        isSingleColumn: false,
        statement: {},
        labels: [],
        selectedLabels: [],
    };

    constructor(props){
        super(props);

        this.handleOnLabelChange = this.handleOnLabelChange.bind(this);
        this.handleOnCommentChange = this.handleOnCommentChange.bind(this);
    }

    handleOnLabelChange(labelId) {
        const statement = JSON.parse(JSON.stringify(this.props.statement));
        let selectedLabels = statement.selectedLabels;
        let labelIndex = selectedLabels.indexOf(labelId);
        if( labelIndex !== -1){
            selectedLabels.splice(labelIndex, 1);
        } else {
            selectedLabels.push(labelId);
        }
        this.props.onStatementChange(statement);
    }

    handleOnCommentChange(comment) {
        const statement = Object.assign({}, this.props.statement);
        statement.comment = comment;
        this.props.onStatementChange(statement);
    }

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
                                selectedLabelArray={statement.selectedLabels}
                                onLabelChange={this.handleOnLabelChange}
                            />
                        )}
                        <Comment
                            onCommentChange={this.handleOnCommentChange}
                        />
                    </ActionsList>
                )
            }
            return (
                <Sequenced
                    statement={statement.statement}
                    actions={actions}
                    //labels={statement.selectedLabels.map(label => labels.filter(labelObject => labelObject.id === label).map(label => label.label))}
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
                    <div className={"h5p-sequence-draggable-container"}>
                        <div
                            className={"h5p-sequence-draggable-element"}
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                        >
                            {this.handleStatementType()}
                        </div>
                    </div>
                )}
            </Draggable>
        )
    }
}