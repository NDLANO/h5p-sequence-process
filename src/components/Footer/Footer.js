import React from 'react';
import { SequenceProcessContext } from "context/SequenceProcessContext";
import Export from "../Export/Export";
import Reset from "./Reset";

function Footer() {
    return (
        <footer>
            <Reset/>
            <Export/>
        </footer>
    );
}

export default Footer;