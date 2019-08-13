import React from 'react';
import { SequenceProcessContext } from "context/SequenceProcessContext";

export default class Footer extends React.Component {

    static contextType = SequenceProcessContext;

    state = {
        behaviour: {
            enableRetry: true,
        },
        translations: {}
    };

    componentDidMount(){
        const {
            behaviour,
            translations,
        } = this.context;
        this.setState({
            behaviour,
            translations
        });
    }

    render() {
        const {
            reset
        } = this.context;
        return (
            <footer>
                {this.state.behaviour.enableRetry === true && (
                    <button
                        className={"h5p-sequence-button-restart"}
                        onClick={reset}
                    >
                        <i className={"fa fa-refresh"} />
                        {this.state.translations.restart}
                    </button>
                )}
            </footer>
        );
    }
}