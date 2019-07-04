import React from 'react';
import { SequenceProcessContext } from "context/SequenceProcessContext";
import Popover from "../Popover/Popover";

export default class Comment extends React.Component {

    static contextType = SequenceProcessContext;

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
                handleClose={this.onToggleModal}
                show={this.state.showPopover}
                popoverContent={(
                    <div>
                        <textarea placeholder={translations.typeYourReasonsForSuchAnswers} />
                        <div>
                            <button>Save</button>
                        </div>
                    </div>
                )}
            >
                <div
                    onClick={this.onToggleModal}
                    className={"h5p-sequence-action"}
                >
                    <i
                        className={"fa fa-commenting-o"}
                    />
                </div>
            </Popover>
        );
    }
}