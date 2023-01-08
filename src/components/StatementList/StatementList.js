import React, {Fragment, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Draggable} from "react-beautiful-dnd";
import classnames from 'classnames';
import Remaining from "../StatementTypes/Remaining";
import Sequenced from "../StatementTypes/Sequenced";
import Placeholder from "../StatementTypes/Placeholder";
import ActionsList from "../Actions/ActionsList";
import Comment from "../Actions/Comment";
import Labels from "../Actions/Labels";

function StatementList(props) {
    const inputRef = useRef();
    const [showCommentContainer, toggleCommentContainer] = useState(false);

    function handleStatementType(isDragging) {
        const {
            statement,
            draggableType,
            isSingleColumn,
            labels,
            enableEditing,
            translate,
            index,
        } = props;

        if (draggableType === 'remaining') {
            return (
                <Remaining
                    statement={statement}
                    onStatementChange={handleOnStatementTextEdit}
                    enableEditing={enableEditing}
                    isDragging={isDragging}
                    onStatementDelete={handleOnStatementDelete}
                />
            );
        } else if (draggableType === 'sequenced' && !statement.isPlaceholder) {
            let actions;
            if (isSingleColumn) {
                actions = (
                    <Fragment>
                        {labels.length > 0 && (
                            <ActionsList>
                                <Labels
                                    labels={labels}
                                    selectedLabelArray={statement.selectedLabels}
                                    onLabelChange={handleOnLabelChange}
                                />
                            </ActionsList>
                        )}
                        <ActionsList>
                            <Comment
                                onCommentChange={handleOnCommentChange}
                                comment={statement.comment}
                                onClick={handleCommentClick()}
                                inputRef={inputRef}
                            />
                        </ActionsList>
                    </Fragment>
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
                    onStatementChange={handleOnStatementTextEdit}
                    enableEditing={enableEditing}
                    isDragging={isDragging}
                    index={index}
                    onStatementDelete={handleOnStatementDelete}
                />
            )
        } else if (draggableType === 'sequenced') {
            return (
                <Placeholder
                    translate={translate}
                    index={index}
                >
                    <div
                        className={"h5p-sequence-empty"}
                    />
                </Placeholder>
            );
        }
    }

    function handleCommentClick() {
        if (props.enableCommentDisplay !== true) {
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
        if (!comment || comment.length === 0) {
            toggleCommentContainer(false);
        }
    }

    function handleOnStatementDelete() {
        props.onStatementDelete(props.statement.id);
    }

    function handleOnStatementTextEdit(statementText) {
        const statement = Object.assign({}, props.statement);
        statement.statement = statementText;
        statement.editMode = false;
        props.onStatementChange(statement);
    }

    function handleOnLabelChange(labelId) {
        const statement = JSON.parse(JSON.stringify(props.statement));
        let selectedLabels = statement.selectedLabels;
        let labelIndex = selectedLabels.indexOf(labelId);
        if (labelIndex !== -1) {
            selectedLabels.splice(labelIndex, 1);
        } else {
            selectedLabels.push(labelId);
        }
        props.onStatementChange(statement);
    }

    function getAriaLabel() {
        const {
            translate
        } = props;

        let ariaLabel = "draggableItem";
        if (draggableType === 'prioritized') {
            ariaLabel = 'dropzone';
            if (statement.touched) {
                ariaLabel = 'dropzoneWithValue';
            }
        }

        return translate(ariaLabel, {
            ':statement': statement.statement
        });
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
            isDragDisabled={draggableType === 'sequenced' && statement.isPlaceholder}
        >
            {(provided, snapshot) => {
                return (
                    <div
                        className={"h5p-sequence-draggable-container"}
                    >
                        <div
                            className={classnames("h5p-sequence-draggable-element", {
                                'h5p-sequence-no-transform': props.disableTransform,
                            })}
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                        >
                            {handleStatementType(snapshot.isDragging)}
                        </div>
                    </div>
                )
            }}
        </Draggable>
    )
}


StatementList.propTypes = {
    statement: PropTypes.object,
    index: PropTypes.number.isRequired,
    draggableType: PropTypes.string.isRequired,
    isSingleColumn: PropTypes.bool,
    onStatementChange: PropTypes.func,
    labels: PropTypes.array,
    selectedLabels: PropTypes.array,
    enableCommentDisplay: PropTypes.bool,
    enableEditing: PropTypes.bool,
    disableTransform: PropTypes.bool,
    translate: PropTypes.func,
    onStatementDelete: PropTypes.func,
};

StatementList.defaultProps = {
    isSingleColumn: false,
    statement: {},
    enableCommentDisplay: false,
    labels: [],
    selectedLabels: [],
    enableEditing: false,
    disableTransform: false,
};

export default StatementList;
