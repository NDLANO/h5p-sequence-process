import React from 'react';
import classnames from 'classnames';
import { SequenceProcessContext } from "../../context/SequenceProcessContext";

export default class Summary extends React.PureComponent {

    static contextType = SequenceProcessContext;

    render() {
        const {
            translations
        } = this.context;
        return (
            <div className={classnames('h5p-sequence-summary')}>
                <p>Summary</p>
                <textarea
                    placeholder={translations.typeYourReasonsForSuchAnswers}
                />
            </div>
        );
    }
};
