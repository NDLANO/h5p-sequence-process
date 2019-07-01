import React from 'react';
import md5 from 'md5';
import { SequenceProcessContext } from 'context/SequenceProcessContext';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from 'components/Column/Column';
import Statement from "../Statement/Statement";

export default class SequenceSurface extends React.Component {

    static contextType = SequenceProcessContext;

    state = {
        statements: [],
        sequencedStatements: [],
        remainingStatements: [],
    };

    constructor(props) {
        super(props);

        this.onDropEnd = this.onDropEnd.bind(this);
        this.onDropUpdate = this.onDropUpdate.bind(this);
    }

    onDropUpdate(update) {
        console.log(update);
    }

    onDropEnd(dragResult) {
        console.log(dragResult);
        let {
            combine,
            destination,
            source,
            draggableId
        } = dragResult;

        if (!combine && !destination) {
            return;
        }

        if (destination !== null && destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }
        const newSequencedStatements = Array.from(this.state.sequencedStatements);
        const newRemainingStatements = Array.from(this.state.remainingStatements);

        if (combine !== null) {
            draggableId = combine.draggableId.replace("sequenced-", "");
            const combinationIndex = this.state.placeholderElements.indexOf(draggableId);
            newSequencedStatements.splice(combinationIndex, 0, draggableId);
        } else if (destination !== null) {
            draggableId = draggableId.replace("remaining-", "");
            newSequencedStatements.splice(destination.index, 1, draggableId);
        }
        newRemainingStatements.splice(source.index, 1);
        this.state.statements[draggableId].isPlaceholder = destination === 'processed';

        this.setState({
            sequencedStatements: newSequencedStatements,
            remainingStatements: newRemainingStatements,
        });
    }

    getUniqueId(existing) {
        const id = md5(Math.floor(Math.random() * 1000000));
        if (existing.hasOwnProperty(id)) {
            return this.getUniqueId(existing);
        }
        return id;
    }

    componentDidMount() {
        const {
            params
        } = this.context;
        const statements = params.statementsList.reduce((existing, current, index) => {
            const id = md5(current);
            existing[id] = {
                id: id,
                statement: current,
//                initIndex: index,
                isPlaceholder: false,
//                placeholderId: this.getUniqueId(existing),
            };
            return existing;
        }, {});

        this.setState({
            statements: statements,
            remainingStatements: [],
            sequencedStatements: Object.keys(statements),
        });
    }

    render() {
        return (
            <div
                className="h5p-sequenceSurface"
            >
                <DragDropContext
                    className="h5p-sequenceSurface"
                    onDragEnd={this.onDropEnd}
                >
                    <Column
                        droppableId={"processed"}
                        combine={true}
                        columnType="sequenced"
                    >
                        {this.state.sequencedStatements
                            .map(statementId => this.state.statements[statementId])
                            .map((statement, index) => (
                                <Statement
                                    key={"sequenced-" + statement.id}
                                    draggableType="sequenced"
                                    statement={statement}
                                    index={index}
                                />
                            ))
                        }
                    </Column>
                    <Column
                        droppableId="start"
                        disableDrop={true}
                        columnType="remaining"
                    >
                        {this.state.remainingStatements
                            .map(statementId => this.state.statements[statementId])
                            .map((statement, index) => (
                                <Statement
                                    key={"remaining-" + statement.id}
                                    draggableType="remaining"
                                    statement={statement}
                                    index={index}
                                />
                            ))
                        }
                    </Column>
                </DragDropContext>
            </div>
        );
    }
}