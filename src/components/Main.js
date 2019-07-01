import './SPStyle.scss';
import React, {Fragment} from 'react';
import Header from 'components/Header/Header';
import SequenceSurface from 'components/SequenceSurface/SequenceSurface';
import Summary from "./Summary/Summary";

export default class Main extends React.Component {
    render() {
        return (
            <Fragment>
                <Header />
                <SequenceSurface />
                <Summary/>
            </Fragment>
        );
    }
}
