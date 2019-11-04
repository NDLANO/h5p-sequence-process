import React, {Fragment} from 'react';
import md5 from 'md5';
import {SequenceProcessContext} from 'context/SequenceProcessContext';
import {DragDropContext} from 'react-beautiful-dnd';
import Column from '../Column/Column';
import StatementList from "../StatementList/StatementList";
import AddStatement from "../AddStatement/AddStatement";
import Summary from "../Summary/Summary";

function StatementDataObject(initValues) {
    this.id = null;
    this.comment = null;
    this.added = false;
    this.statement = null;
    this.isPlaceholder = false;
    this.isUserAdded = false;
    this.editMode = false;
    this.touched = false;
    this.selectedLabels = [];
    return Object.assign(this, initValues);
}

export default class SequenceSurface extends React.Component {

    static contextType = SequenceProcessContext;

    state = {
        statements: [],
        sequencedStatements: [],
        remainingStatements: [],
        showOneColumn: false,
        labels: [],
    };

    constructor(props) {
        super(props);

        this.init = this.init.bind(this);
        this.onDropEnd = this.onDropEnd.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDropUpdate = this.onDropUpdate.bind(this);
        this.sendExportValues = this.sendExportValues.bind(this);
        this.handleOnStatementChange = this.handleOnStatementChange.bind(this);
        this.handleOnAddNewRemainingItem = this.handleOnAddNewRemainingItem.bind(this);
        this.handleOnAddNewPrioritizedItem = this.handleOnAddNewPrioritizedItem.bind(this);
    }

    onDragStart(element) {
        if (window.navigator.vibrate) {
            window.navigator.vibrate(100);
        }
        this.setState({isCombineEnabled: element.source.droppableId !== 'processed'});
    }

    onDropUpdate(result) {
        if (!result.destination || (result.source && result.source.droppableId === 'start')) {
            return;
        }

        const {
            statements
        } = this.state;

        const statementClone = JSON.parse(JSON.stringify(statements));
        const destinationIndex = result.destination.index;
        const sequencedStatements = Array.from(this.state.sequencedStatements);

        const dragged = statementClone[sequencedStatements[result.source.index]];
        const previousDraggedIndex = dragged.displayIndex;
        dragged.displayIndex = destinationIndex + 1;
        const draggedIndexDifference = dragged.displayIndex - previousDraggedIndex;
        sequencedStatements
            .map(statementId => statementClone[statementId])
            .map((statementClone, index) => {
                if (statementClone.displayIndex === destinationIndex + 1 && index !== result.source.index) {
                    statementClone.displayIndex -= draggedIndexDifference;
                }
            });

        this.setState({
            statements: statementClone,
        });
    }

    onDropEnd(dragResult) {
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
        const sequencedStatements = Array.from(this.state.sequencedStatements);
        const remainingStatements = Array.from(this.state.remainingStatements);
        const newStatements = JSON.parse(JSON.stringify(this.state.statements));

        if (source && destination && source.droppableId === destination.droppableId) {
            draggableId = parseInt(draggableId.replace(/\w+-/, ""), 10);
            sequencedStatements.splice(source.index, 1);
            sequencedStatements.splice(destination.index, 0, draggableId);
        } else {
            const statementId = remainingStatements[source.index];
            const draggedStatement = newStatements[statementId];
            const draggedIndex = sequencedStatements.indexOf(statementId);
            let droppedIndex = null;
            if (combine !== null) {
                droppedIndex = sequencedStatements.indexOf(parseInt(combine.draggableId.replace("sequenced-", ""), 10));
            } else {
                droppedIndex = destination.index < sequencedStatements.length ? destination.index : sequencedStatements.length - 1;
            }

            const droppedOnStatement = newStatements[sequencedStatements[droppedIndex]];
            if (droppedIndex !== -1 && draggedIndex !== -1) {
                [sequencedStatements[droppedIndex], sequencedStatements[draggedIndex]] = [sequencedStatements[draggedIndex], sequencedStatements[droppedIndex]];
            } else if (draggedIndex === -1) {
                sequencedStatements.splice(droppedIndex, 1, statementId);
            }

            if( droppedOnStatement.touched === true){
                remainingStatements.push(droppedOnStatement.id);
                droppedOnStatement.touched = false;
                droppedOnStatement.isPlaceholder = true;
            }

            if (remainingStatements.length > 0 && source.droppableId !== 'processed') {
                remainingStatements.splice(source.index, 1);
            }

            draggedStatement.isPlaceholder = destination === 'processed';
            draggedStatement.touched = true;
        }

        sequencedStatements.forEach((statementId, index) => {
            newStatements[statementId].displayIndex = index + 1;
        });

        this.setState({
            statements: newStatements,
            sequencedStatements: sequencedStatements,
            remainingStatements: remainingStatements,
            showOneColumn: remainingStatements.length === 0,
            canAddPrioritized: remainingStatements.length === 0 && this.context.behaviour.allowAddingOfStatements && sequencedStatements.filter(statementId => !newStatements[statementId].touched).length > 0,
        }, () => this.context.trigger('resize'));
    }

    sendExportValues() {
        const {
            labels,
            statements,
            sequencedStatements,
        } = this.state;
        return {
            labels,
            statements,
            sequencedStatements,
        }
    }

    componentDidMount() {
        const {
            registerReset,
            collectExportValues
        } = this.context;
        this.init();
        registerReset(this.init);
        collectExportValues('userInput', this.sendExportValues);
    }

    init() {
        const {
            params: {
                statementsList = [],
                labelsList = [],
            },
            behaviour: {
                prepopulate: prepopulated = false,
                randomizeStatements = false,
                allowAddingOfStatements = false,
                numberOfStatements = statementsList.length,
            }
        } = this.context;

        if (numberOfStatements > statementsList.length) {
            new Array(numberOfStatements - statementsList.length)
                .fill(null)
                .forEach(element => statementsList.push(element));
        }

        if (randomizeStatements === true) {
            statementsList.sort(() => 0.5 - Math.random());
        }

        const statements = statementsList.map((statement, index) => {
            const statementObject = new StatementDataObject({
                id: index,
            });

            if (statement !== null) {
                statementObject.statement = statement;
                statementObject.isPlaceholder = !prepopulated;
                statementObject.touched = prepopulated && statementObject.displayIndex <= numberOfStatements;
            } else {
                statementObject.isPlaceholder = true;
                statementObject.added = true;
            }
            return statementObject;
        });

        const remainingStatements = prepopulated === true ? statements.slice(numberOfStatements) : statements.filter(statement => statement.added === false);

        this.setState({
            statements: statements,
            remainingStatements: remainingStatements.map(statement => statement.id),
            sequencedStatements: statements.filter((statement, index) => index < numberOfStatements || statement.touched).map(statement => statement.id),
            labels: labelsList.map(label => {
                return {
                    id: md5(label),
                    label,
                };
            }),
            showOneColumn: prepopulated,
            canAddPrioritized: allowAddingOfStatements && statements.filter(statement => statement.touched).length < statements.length && remainingStatements.length === 0,
        });
    }

    handleOnStatementChange(statement) {
        this.setState({
            statements: {
                ...this.state.statements,
                [statement.id]: statement
            }
        }, () => this.context.trigger('resize'));

    }

    addNewStatement() {
        const statements = JSON.parse(JSON.stringify(this.state.statements));
        const id = statements.length;
        const newItem = new StatementDataObject({
            id: id,
            added: true,
            isUserAdded: true,
            editMode: true,
            statement: "",
        });
        statements.push(newItem);
        return [statements, id];
    }

    handleOnAddNewRemainingItem() {
        const [statements, id] = this.addNewStatement();
        const remainingStatements = Array.from(this.state.remainingStatements);
        remainingStatements.push(id);

        this.setState({
            statements,
            remainingStatements,
        }, () => this.context.trigger('resize'));
    }

    handleOnAddNewPrioritizedItem() {
        const statements = JSON.parse(JSON.stringify(this.state.statements));
        const sequencedStatements = Array.from(this.state.sequencedStatements);
        const untouched = sequencedStatements.filter(elementId => statements[elementId].touched === false);

        if( untouched.length > 0){
            const statementId = untouched.shift();
            statements[statementId].editMode = true;
            statements[statementId].touched = true;
            statements[statementId].isPlaceholder = false;
        }

        this.setState({
            statements,
            canAddPrioritized: untouched.length > 0,
        }, () => this.context.trigger('resize'));
    }


    handleSurface() {
        return (
            <Fragment>
                <Column
                    droppableId={"processed"}
                    combine={this.state.isCombineEnabled}
                    additionalClassName={"h5p-sequence-dropzone"}
                >
                    {this.state.sequencedStatements
                        .map(statementId => this.state.statements[statementId])
                        .map((statement, index) => (
                            <StatementList
                                key={"sequenced-" + statement.id}
                                draggableType="sequenced"
                                statement={statement}
                                index={index}
                                isSingleColumn={this.state.showOneColumn}
                                onStatementChange={this.handleOnStatementChange}
                                enableEditing={this.context.behaviour.allowAddingOfStatements}
                                enableCommentDisplay={this.context.behaviour.displayCommentsBelowStatement}
                                disableTransform={this.state.isCombineEnabled}
                                translate={this.context.translate}
                                labels={this.state.labels}
                                selectedLabels={statement.selectedLabels}
                            />
                        ))
                    }
                    {this.state.canAddPrioritized === true && (
                        <AddStatement
                            onClick={this.handleOnAddNewPrioritizedItem}
                            translations={this.context.translations}
                        />
                    )}
                </Column>
                {this.state.remainingStatements.length > 0 && (
                    <Column
                        droppableId="start"
                        disableDrop={true}
                        columnType="remaining"
                        additionalClassName={"h5p-sequence-select-list"}
                    >
                        {this.state.remainingStatements
                            .map(statementId => this.state.statements[statementId])
                            .map((statement, index) => (
                                <StatementList
                                    key={"remaining-" + statement.id}
                                    draggableType="remaining"
                                    statement={statement}
                                    index={index}
                                    onStatementChange={this.handleOnStatementChange}
                                    enableEditing={this.context.behaviour.allowAddingOfStatements}
                                    translate={this.context.translate}
                                />
                            ))
                        }
                        {this.context.behaviour && this.context.behaviour.allowAddingOfStatements === true && (
                            <AddStatement
                                onClick={this.handleOnAddNewRemainingItem}
                                translations={this.context.translations}
                            />
                        )}
                    </Column>
                )}
            </Fragment>
        );
    }

    render() {
        const {
            collectExportValues,
            registerReset,
            behaviour,
            translate
        } = this.context;

        return (
            <div>
                <div
                    className="h5p-sequence-surface"
                >
                    <DragDropContext
                        onDragEnd={this.onDropEnd}
                        onDragUpdate={this.onDropUpdate}
                        onDragStart={this.onDragStart}
                    >
                        {this.handleSurface()}
                    </DragDropContext>
                </div>
                {behaviour.provideSummary === true && (
                    <Summary
                        reset={registerReset}
                        exportValues={collectExportValues}
                        translate={translate}
                    />
                )}
            </div>
        );
    }
}