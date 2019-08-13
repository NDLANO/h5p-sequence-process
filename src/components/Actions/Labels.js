import React from 'react';
import PropTypes from 'prop-types';
import { SequenceProcessContext } from "../../context/SequenceProcessContext";
import Popover from "../Popover/Popover.js";

export default class Labels extends React.PureComponent {

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
                        <button
                            onClick={this.onToggleModal}
                        >{translations.save}</button>
                    </div>
                )}
            >
                <div
                    onClick={this.onToggleModal}
                    className={"h5p-sequence-action"}
                >
                    <i
                        className={"fa fa-tags"}
                    />
                </div>
            </Popover>
        );
    }
}