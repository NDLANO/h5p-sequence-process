import React from 'react';
import PropTypes from 'prop-types';
import Placeholder from "./Placeholder";
import classnames from "classnames";
import DragArrows from "./components/DragArrows";
import StatementComment from "./components/StatementComment";
import StatementLabel from "./components/StatementLabel";

const Sequenced = props => {
    const {
        statement,
        actions,
        enableCommentDisplay,
        onCommentChange,
        inputRef,
        labels,
        onLabelChange,
    } = props;

    return (
        <Placeholder
            className="h5p-droparea"
        >
            <div
                className={classnames("h5p-sequence-statement", {
                    'h5p-sequence-statement-extra': (enableCommentDisplay && statement.comment && statement.comment.length > 0) || statement.selectedLabels.length > 0
                })}
            >
                <div>
                    <DragArrows />
                    {statement.statement}
                </div>
                {actions}
            </div>
            <div
                className={classnames("h5p-sequence-statement-container", {
                    "hidden": (statement.selectedLabels.length === 0 && !enableCommentDisplay)
                })}
            >
                <StatementLabel
                    selectedLabels={statement.selectedLabels}
                    labels={labels}
                    onLabelChange={onLabelChange}
                />
                <StatementComment
                    comment={statement.comment}
                    onCommentChange={onCommentChange}
                    inputRef={inputRef}
                    show={enableCommentDisplay}
                />
            </div>
        </Placeholder>
    );

};

Sequenced.propTypes = {
    statement: PropTypes.object,
    actions: PropTypes.object,
    enableCommentDisplay: PropTypes.bool,
    onCommentChange: PropTypes.func,
    inputRef: PropTypes.object,
    labels: PropTypes.array,
    onLabelChange: PropTypes.func,
};

export default Sequenced;
