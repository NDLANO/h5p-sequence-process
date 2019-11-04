import React from 'react';
import { SequenceProcessContext } from "context/SequenceProcessContext";
import Export from "../Export/Export";
import Reset from "./Reset";

function Footer() {
    return (
        <section className={"h5p-sequence-footer"}>
            <Reset/>
            <Export/>
        </section>
    );
}

export default Footer;