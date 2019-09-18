import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import { SequenceProcessContext } from "../../context/SequenceProcessContext";
import Popover from "../Popover/Popover.js";
import classnames from "classnames";

function Labels(props){

    const [showPopover, togglePopover] = useState(props.selectedLabelArray.length > 0)

    const context = useContext(SequenceProcessContext);

    function handleToggle() {
        togglePopover(!showPopover);
    }

    const {
        labels,
        selectedLabelArray,
        onLabelChange,
    } = props;

    return (
        <Popover
            show={showPopover}
            handleClose={handleToggle}
            popoverContent={(
                <div className={"h5p-sequence-label-popover"}>
                    <p>{context.translations.selectAllLabelsConnectedToThisItem}</p>
                    <div className={"h5p-sequence-label-list"}>
                        {labels.map(label => (
                            <label
                                key={label.id}
                            >
                                <input
                                    value={label.id}
                                    type={"checkbox"}
                                    checked={selectedLabelArray.indexOf(label.id) !== -1}
                                    onChange={() => onLabelChange(label.id)}
                                />
                                <span className={"checkmark"} />
                                {label.label}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        >
            <button
                onClick={handleToggle}
                className={classnames("h5p-sequence-action", {
                    'h5p-sequence-action-active': props.selectedLabelArray && props.selectedLabelArray.length > 0,
                })}
            >
                <i
                    className={"fa fa-tags"}
                />
            </button>
        </Popover>
    );
}

Labels.propTypes = {
    labels: PropTypes.array,
    onLabelChange: PropTypes.func,
    selectedLabelArray: PropTypes.array,
};

Labels.defaultProps = {
    labels: [],
    selectedLabelArray: [],
};

export default Labels;

export class Labels2 extends React.PureComponent {

    static contextType = SequenceProcessContext;

    static propTypes = {
        labels: PropTypes.array,
        onLabelChange: PropTypes.func,
        selectedLabelArray: PropTypes.array,
    };

    static defaultProps = {
        labels: [],
        selectedLabelArray: [],
    };

    state = {
        showPopover: false,
    };

    constructor(props){
        super(props);

        this.onToggleModal = this.onToggleModal.bind(this);
    }

    onToggleModal() {
        this.setState({
            showPopover: !this.state.showPopover
        })
    }

    render() {
        const {
            translations
        } = this.context;

        return (
            <Popover
                show={this.state.showPopover}
                handleClose={this.onToggleModal}
                popoverContent={(
                    <div className={"h5p-sequence-label-popover"}>
                        <p>{translations.selectAllLabelsConnectedToThisItem}</p>
                        <div className={"h5p-sequence-label-list"}>
                        {this.props.labels.map(label => (
                            <label
                                key={label.id}
                            >
                                <input
                                    value={label.id}
                                    type={"checkbox"}
                                    checked={this.props.selectedLabelArray.indexOf(label.id) !== -1}
                                    onChange={() => this.props.onLabelChange(label.id)}
                                /> {label.label}
                            </label>
                        ))}
                        </div>
                    </div>
                )}
            >
                <button
                    onClick={this.onToggleModal}
                    className={classnames("h5p-sequence-action", {
                        'h5p-sequence-action-active': props.selectedLabelArray && props.selectedLabelArray.length > 0,
                    })}
                >
                    <i
                        className={"fa fa-tags"}
                    />
                </button>
            </Popover>
        );
    }
}