import React from 'react';
import { SequenceProcessContext } from "context/SequenceProcessContext";
import Export from "../Export/Export";

function Footer() {
    return (
        <SequenceProcessContext.Consumer>
            {({behaviour, reset, translations}) => (
                <footer>
                    {behaviour.enableRetry === true && (
                        <button
                            className={"h5p-sequence-button-restart"}
                            onClick={reset}
                        >
                            <i className={"fa fa-refresh"} />
                            {translations.restart}
                        </button>
                    )}
                    <Export/>
                </footer>
            )}
        </SequenceProcessContext.Consumer>
    );
}

export default Footer;