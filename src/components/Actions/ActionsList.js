import React from 'react';

const ActionsList = (
    {children}
) => {
    return (
        <div className={"h5p-sequence-actionlist"}>
            <div>
                {children}
            </div>
        </div>
    );
};

export default ActionsList;