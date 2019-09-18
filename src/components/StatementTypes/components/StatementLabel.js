import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function StatementLabel(props) {

    const {
        labels,
        selectedLabels,
        onLabelChange,
    } = props;
    return (
        <div
            className={classnames("h5p-sequence-statement-labels", {
                "hidden": selectedLabels.length === 0,
            })}
        >
            <i
                className={"fa fa-tags"}
            />
            <div>
                {labels.filter(label => selectedLabels.indexOf(label.id) !== -1)
                    .map(label => (
                        <span
                            key={label.id}
                            className={"h5p-sequence-statement-label"}
                        >
                            {label.label}
                            <i
                                tabIndex={0}
                                className={"fa fa-times"}
                                onClick={() => onLabelChange(label.id)}
                                onKeyUp={event => {
                                    if (event.keyCode && event.keyCode == 8){
                                        onLabelChange(label.id);
                                    }
                                }}
                            />
                        </span>
                    ))}
            </div>
        </div>
    )
}

StatementLabel.propTypes = {
    labels: PropTypes.array,
    selectedLabels: PropTypes.array,
    onLabelChange: PropTypes.func,
};

StatementLabel.defaultProps = {
    labels: [],
    selectedLabels: [],
};

export default StatementLabel;