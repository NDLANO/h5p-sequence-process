import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import { Draggable } from "react-beautiful-dnd";
import Remaining from "../StatementTypes/Remaining";
import Sequenced from "../StatementTypes/Sequenced";
import Placeholder from "../StatementTypes/Placeholder";
import ActionsList from "../Actions/ActionsList";
import Comment from "../Actions/Comment";
import Labels from "../Actions/Labels";

function StatementList(props) {
    const inputRef = useRef();
    const [showCommentContainer, toggleCommentContainer] = useState(false);

    function handleStatementType() {
        const {
            statement,
            draggableType,
            isSingleColumn,
            labels,
        } = props;

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
                                onLabelChange={handleOnLabelChange}
                            />
                        )}
                        <Comment
                            onCommentChange={handleOnCommentChange}
                            comment={statement.comment}
                            onClick={handleCommentClick()}
                        />
                    </ActionsList>
                )
            }
            return (
                <Sequenced
                    statement={statement}
                    actions={actions}
                    enableCommentDisplay={showCommentContainer}
                    inputRef={inputRef}
                    onCommentChange={handleOnCommentChange}
                    labels={labels}
                    onLabelChange={handleOnLabelChange}
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

    function handleCommentClick() {
        if( props.enableCommentDisplay !== true){
            return null;
        }

        return () => {
            toggleCommentContainer(true);
            setTimeout(() => inputRef.current.focus(), 0);
        }
    }

    function handleOnCommentChange(comment) {
        const statement = Object.assign({}, props.statement);
        statement.comment = comment;
        props.onStatementChange(statement);
        if( !comment || comment.length === 0){
            toggleCommentContainer(false);
        }
    }

    function handleOnLabelChange(labelId){
        const statement = JSON.parse(JSON.stringify(props.statement));
        let selectedLabels = statement.selectedLabels;
        let labelIndex = selectedLabels.indexOf(labelId);
        if( labelIndex !== -1){
            selectedLabels.splice(labelIndex, 1);
        } else {
            selectedLabels.push(labelId);
        }
        props.onStatementChange(statement);
    }

    const {
        index,
        statement,
        draggableType,
    } = props;

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
                        {handleStatementType()}
                    </div>
                </div>
            )}
        </Draggable>
    )
}


StatementList. propTypes = {
    statement: PropTypes.object,
    index: PropTypes.number.isRequired,
    draggableType: PropTypes.string.isRequired,
    isSingleColumn: PropTypes.bool,
    onStatementChange: PropTypes.func,
    labels: PropTypes.array,
    selectedLabels: PropTypes.array,
    enableCommentDisplay: PropTypes.bool,
};

StatementList.defaultProps = {
    isSingleColumn: false,
    statement: {},
    enableCommentDisplay: false,
    labels: [],
    selectedLabels: [],
};

export default StatementList;
