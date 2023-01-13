import React, {useContext} from 'react';
import classnames from 'classnames';
import {SequenceProcessContext} from "context/SequenceProcessContext";

const Placeholder = ({
                         children,
                         isDraggingOver = false,
                         index,
                     }) => {
    const context = useContext(SequenceProcessContext);

    const {
        translate
    } = context;

    return (
        <div>
            <div
                className={classnames("h5p-droparea", {
                    "h5p-sequence-active-droppable": isDraggingOver
                })}
            >
                {children}
            </div>
        </div>
    );
};

export default Placeholder;
