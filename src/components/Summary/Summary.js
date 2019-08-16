import React from 'react';
import classnames from 'classnames';
import { SequenceProcessContext } from "../../context/SequenceProcessContext";

export default class Summary extends React.PureComponent {

    static contextType = SequenceProcessContext;

    constructor(props){
        super(props);
        this.state = Summary.getInitState();

        this.handleReset = this.handleReset.bind(this);
        this.sendExportValues = this.sendExportValues.bind(this);
    }

    sendExportValues() {
        return this.state.comment;
    }

    componentDidMount() {
        const {
            registerReset,
            collectExportValues,
        } = this.context;

        collectExportValues('summary', this.sendExportValues);
        registerReset(this.handleReset);
    }

    static getInitState() {
        return {
            comment: ''
        }
    }

    handleReset(){
        this.setState(Summary.getInitState())
    }

    render() {
        const {
            translations,
            behaviour
        } = this.context;

        if(behaviour.provideSummary !== true){
            return null;
        }

        return (
            <div className={classnames('h5p-sequence-summary')}>
                <p>{translations.summary}</p>
                <textarea
                    placeholder={translations.typeYourReasonsForSuchAnswers}
                    value={this.state.comment}
                    onChange={event => this.setState({comment: event.target.value})}
                />
            </div>
        );
    }
};
