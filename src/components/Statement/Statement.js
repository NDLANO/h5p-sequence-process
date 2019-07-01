import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from "react-beautiful-dnd";
import classnames from 'classnames';

export default class Statement extends React.Component{
    static propTypes = {
        statement: PropTypes.object,
        index: PropTypes.number,
        draggableType: PropTypes.string,
    };

    render() {
        const {
            index,
            statement,
            draggableType,
        } = this.props;

        return (
            <Draggable
                draggableId={draggableType + "-" + statement.id}
                index={index}
            >
                {provided => (
                    <div
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        className={classnames({
                            "h5p-droparea": draggableType === 'sequenced',
                        })}
                    >
                        <div
                            className={classnames({
                                "h5p-sequence-statement" : (draggableType === 'remaining' || (draggableType === 'sequenced' && !statement.isPlaceholder))
                            })}
                        >
                            {(draggableType === 'remaining' || (draggableType === 'sequenced' && !statement.isPlaceholder)) && statement.statement}
                        </div>
                    </div>
                )}
            </Draggable>
        )
    }
}