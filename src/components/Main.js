import './SPStyle.scss';
import React, {Fragment} from 'react';
import Header from './Header/Header';
import SequenceSurface from '../components/SequenceSurface/SequenceSurface';
import Summary from "./Summary/Summary";
import Footer from "./Footer/Footer";

function Main() {
    return (
        <Fragment>
            <Header />
            <SequenceSurface />
            <Summary/>
            <Footer/>
        </Fragment>
    );
}

export default Main;
