import React, {useContext} from 'react';
import {SequenceProcessContext} from "context/SequenceProcessContext";

function DragArrows() {
    const context = useContext(SequenceProcessContext);

    return (
        <div className={"h5p-sequence-drag-element"}>
             <span
                 className="h5p-ri hri-move"
                 aria-hidden={"true"}
             />
            <span className={"visible-hidden"}>{context.translations.drag}</span>
        </div>
    );
}

export default DragArrows;