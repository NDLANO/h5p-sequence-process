import React, {Fragment} from 'react';
import {SequenceProcessContext} from 'context/SequenceProcessContext';
import ActionsList from '../Actions/ActionsList';
import Comment from '../Actions/Comment';
import Labels from '../Actions/Labels';
import SortableList from './SortableList';
import SortableItem from './SortableItem';
import Summary from '../Summary/Summary';
import Remaining from '../StatementTypes/Remaining';
import { StatementDataObject } from 'components/utils';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
// Import custom sensors
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Sequenced from '../StatementTypes/Sequenced';

function SequenceSurfaceWithSensors(props) {
  return <SequenceSurface {...props}  />;
}

class SequenceSurface extends React.Component {

  static contextType = SequenceProcessContext;

  state = {
    statements: [],
    sequencedStatements: [],
    remainingStatements: [],
    showOneColumn: false,
    labels: [],
    draggableSourceId: null,
    draggableSourceIndex: null,
    activeId: null,
    transition: false,
  };

  constructor(props) {
    super(props);

    this.init = this.init.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this); // Ensure this is bound correctly
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.sendExportValues = this.sendExportValues.bind(this);
    this.handleOnStatementChange = this.handleOnStatementChange.bind(this);
    this.handleOnAddNewRemainingItem = this.handleOnAddNewRemainingItem.bind(this);
    this.handleOnAddNewSequencedItem = this.handleOnAddNewSequencedItem.bind(this);
    this.handleOnDeleteStatement = this.handleOnDeleteStatement.bind(this);
  }

  handleDragStart = (event) => {
    const { active } = event;
    const activePrefix = active.id.split('-')[0];
    this.setState({
      activeId: active.id,
      transition: activePrefix === 'sequenced' ? true : false,
    });
  };

  
  handleDragOver = (event) => {
    const { active, over } = event;
  
    if (over) {
      const overId = over.id;
  
      // Check if the item being dragged over is a "sequenced" item
      if (overId.startsWith('sequenced-') && active.id.startsWith('remaining-')) {
        // Optionally, set state or perform actions based on this information
        this.setState({ draggedOverSequencedItemId: overId });
      } 
      else {
        this.setState({ draggedOverSequencedItemId: null });
      }
    }
  };

  swapElements(array, index1, index2) {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
  }
  
  handleDragEnd = (event) => {
    const { active, over } = event;
    setTimeout(() => {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }, 10);
  
  
    if (over && active.id !== over.id) {
      this.setState((prevState) => {

        // Check if it is a 'remaining' item that is dragged over another 'remaining' item
        if (active.id.includes('remaining') && over.id.includes('remaining')) {
          // Extract the numeric part of the ID by removing the prefix
          const oldIndex = prevState.remainingStatements.indexOf(parseInt(active.id.replace('remaining-', '')));
          const newIndex = prevState.remainingStatements.indexOf(parseInt(over.id.replace('remaining-', '')));
    
          if (oldIndex !== -1 && newIndex !== -1) {
            let newRemainingStatements = [...prevState.remainingStatements];
            const movedItem = newRemainingStatements.splice(oldIndex, 1)[0];
            newRemainingStatements.splice(newIndex, 0, movedItem);
    
            return {
              ...prevState,
              remainingStatements: newRemainingStatements,
              activeId: null,
            };
          }
        }

        // Check if it is a 'sequenced' item that is dragged over another 'sequenced' item
        if (active.id.includes('sequenced') && over.id.includes('sequenced')) {
          // Extract the numeric part of the ID by removing the prefix
          const oldIndex = prevState.sequencedStatements.indexOf(parseInt(active.id.replace('sequenced-', '')));
          const newIndex = prevState.sequencedStatements.indexOf(parseInt(over.id.replace('sequenced-', '')));
    
          if (oldIndex !== -1 && newIndex !== -1) {
            let newSequencedStatements = [...prevState.sequencedStatements];
            const movedItem = newSequencedStatements.splice(oldIndex, 1)[0];
            newSequencedStatements.splice(newIndex, 0, movedItem);
    
            return {
              ...prevState,
              sequencedStatements: newSequencedStatements,
              activeId: null,
            };
          }
        }
  
        return prevState;
      });


      const activePrefix = active.id.split('-')[0];
      const overPrefix = over.id.split('-')[0];
  
      // Check if a 'remaining' item is dragged over a 'sequenced' item
      if (activePrefix === 'remaining' && overPrefix === 'sequenced') {
        // Here you can set state or trigger actions based on the collision
        // Remove the dragged item from the 'remaining' list
        this.setState((prevState) => {
          const draggableId = parseInt(active.id.replace('remaining-', ''));
          const droppableId = parseInt(over.id.replace('sequenced-', ''));
          const dropIndex = prevState.sequencedStatements.indexOf(droppableId);

          // TODO: ensure we can replace a placeholder with a dragged item
          if (this.state.statements[droppableId].isPlaceholder === false) {
            const newStatements = [...prevState.statements];
            const newSequencedStatements = [...prevState.sequencedStatements];

            // Set the dropzone to a placeholder 
            newStatements[droppableId].isPlaceholder = true;

            // Remove the dragged item from the 'remaining' list
            const newRemainingStatements = prevState.remainingStatements.filter((id) => id !== draggableId);

            // Add the replaced item to the 'remaining' list
            const replacedItem = newSequencedStatements[dropIndex];
            newRemainingStatements.push(replacedItem);

            const indexOfElementToMove = newSequencedStatements.indexOf(draggableId);
            this.swapElements(newSequencedStatements, indexOfElementToMove, dropIndex); 
            newStatements[draggableId].isPlaceholder = false;

            return {
              ...prevState,
              remainingStatements: newRemainingStatements,
              sequencedStatements: newSequencedStatements,
              statements: newStatements,
            };
          }

          // Remove the dragged item from the 'remaining' list
          const newRemainingStatements = prevState.remainingStatements.filter((id) => id !== draggableId);

          // Set the dragged item to not be a placeholder
          const draggedStatement = prevState.statements[draggableId];
          draggedStatement.isPlaceholder = false;

          const newSequencedStatements = [...prevState.sequencedStatements];
          const indexOfElementToMove = newSequencedStatements.indexOf(draggableId);
          this.swapElements(newSequencedStatements, indexOfElementToMove, dropIndex);

          return {
            ...prevState,
            remainingStatements: newRemainingStatements,
            sequencedStatements: newSequencedStatements,
            showOneColumn: newRemainingStatements.length === 0,
          };
        });
      }
    }

    this.setState({ 
      activeId: null,
      draggedOverSequencedItemId: null,
    });
  };


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
    };
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
        .forEach((element) => statementsList.push(element));
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
        statementObject.touched = prepopulated && index < numberOfStatements;
      }
      else {
        statementObject.isPlaceholder = true;
        statementObject.added = true;
      }
      return statementObject;
    });

    const remainingStatements = prepopulated === true ? statements.slice(numberOfStatements) : statements.filter((statement) => statement.added === false);

    this.setState({
      statements: statements,
      remainingStatements: remainingStatements.map((statement) => statement.id),
      sequencedStatements: statements.filter((statement, index) => index < numberOfStatements || statement.touched).map((statement) => statement.id),
      labels: labelsList.map((label) => {
        return {
          id: H5P.createUUID(),
          label,
        };
      }),
      showOneColumn: prepopulated,
      canAddPrioritized: allowAddingOfStatements && remainingStatements.length === 0,
    });
  }

  handleOnStatementChange = (statementId, updatedStatement) => {
    const updatedStatements = {...this.state.statements};
    updatedStatements[statementId] = updatedStatement; // Ensure that the statementId corresponds correctly to the keys in the statements object/array.
    this.setState({
      statements: updatedStatements
    }, () => this.context.trigger('resize')); // Triggering resize after state update is optional depending on your application's requirements
  };

  addNewStatement() {
    const statements = Array.from(this.state.statements);
    const id = statements.length;
    const newItem = new StatementDataObject({
      id: id,
      added: true,
      isUserAdded: true,
      editMode: true,
      statement: '',
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

  handleOnAddNewSequencedItem() {
    const [statements, id] = this.addNewStatement();
    statements[id].editMode = true;
    statements[id].touched = true;
    statements[id].isPlaceholder = false;

    const sequencedStatements = Array.from(this.state.sequencedStatements);
    const untouched = sequencedStatements.filter((elementId) => statements[elementId].touched === false);

    if ( untouched.length > 0) {
      const statementId = untouched.shift();
      statements[statementId].editMode = true;
      statements[statementId].touched = true;
      statements[statementId].isPlaceholder = false;
    }
    else {
      sequencedStatements.push(id);
    }

    this.setState({
      statements,
      sequencedStatements,
      canAddPrioritized: this.state.remainingStatements.length === 0 && this.context.behaviour.allowAddingOfStatements,
    }, () => this.context.trigger('resize'));
  }

  handleOnDeleteStatement(deleteFrom, statementId) {
    let sequencedStatements = Array.from(this.state.sequencedStatements);
    let remainingStatements = Array.from(this.state.remainingStatements);
    const statements = Array.from(this.state.statements);
    const currentStatement = Object.assign({}, this.state.statements[statementId]);
    if (deleteFrom === 'remaining') {
      remainingStatements = remainingStatements.filter((statement) => statement !== statementId);
    }
    else if (deleteFrom === 'sequenced') {
      currentStatement.isPlaceholder = true;
      currentStatement.touched = false;
      if ( currentStatement.added === true) {
        sequencedStatements = sequencedStatements.filter((statement) => statement !== statementId);
      }
    }
    statements[currentStatement.id] = currentStatement;
    this.setState({
      statements,
      remainingStatements,
      sequencedStatements,
      showOneColumn: remainingStatements.length === 0,
    }, () => this.context.trigger('resize'));
  }

  renderSortableList = () => {
    return (
      <Fragment>
        {/* <div className='h5p-sequence-column h5p-sequence-dropzone'>
          <SortableList 
            items={this.state.sequencedStatements.map((statementId) => `sequenced-${statementId}`)}
            statements={this.state.statements}
            type={'sequenced'}
            activeId={this.state.activeId}
            draggingOver={this.state.draggedOverSequencedItemId}
            allowTransition={this.state.transition === true}
            isSingleColumn={this.state.showOneColumn}
            labels={this.state.labels}
            onStatementDelete={this.handleOnDeleteStatement}
            onStatementChange={this.handleOnStatementChange}
          /> 
        </div> */}

        <SortableList 
          params={this.context.params}
          translations={this.context.translations}
        />
      </Fragment>
    );
  };

  render() {
    const {
      collectExportValues,
      registerReset,
      behaviour,
      translate,
      params: {
        summaryHeader,
        summaryInstruction
      }
    } = this.context;

    const activeId = this.state.activeId;

    let actions = null; // Initialize actions as null

    if (this.state.activeId) {
      // Only create actions if activeId is defined
      actions = (
        <Fragment>
          {this.state.labels.length > 0 && (
            <ActionsList>
              <Labels
                labels={this.state.labels}
                selectedLabelArray={this.state.statements[activeId]?.selectedLabels}
                onLabelChange={(labelId) => this.handleLabelChange(activeId, labelId)}
              />
            </ActionsList>
          )}
          <ActionsList>
            <Comment
              onCommentChange={() => {}}
              comment={this.state.statements[activeId]?.comment}
              onClick={() => {}}
              inputRef={this.inputRef} // Assuming you have a ref for focusing if needed
            />
          </ActionsList>
        </Fragment>
      );
    }

    return (
      <DndContext 
        onDragEnd={this.handleDragEnd}
        onDragStart={this.handleDragStart}
        onDragOver={this.handleDragOver}
        sensors={this.props.sensors}
      >
        <div>
          <div
            className="h5p-sequence-surface"
          >
            {this.renderSortableList()}
          </div>
          {behaviour.provideSummary === true && (
            <Summary
              reset={registerReset}
              exportValues={collectExportValues}
              translate={translate}
              summaryHeader={summaryHeader}
              summaryInstruction={summaryInstruction}
            />
          )}
        </div>
        <DragOverlay>
          {activeId ? (
            <SortableItem id={activeId}>
              <div className={'h5p-overlay-item'}>
                {activeId && activeId.includes('sequenced') ? (
                  <Sequenced
                    statement={this.state.statements[activeId.replace(/(sequenced-)/, '')]}
                    actions={actions}
                    enableCommentDisplay={this.state.statements[activeId.replace(/(sequenced-)/, '')].comment !== null}
                    inputRef={null}
                    onCommentChange={() => {}}
                    onLabelChange={() => {}}
                    onStatementChange={() => {}}
                    enableEditing={false}
                    isDragging={true}
                  />
                ) : (
                  <Remaining
                    statement={this.state.statements[activeId.replace(/(remaining-)/, '')]}
                    onStatementChange={() => {}}
                    enableEditing={false}
                    onStatementDelete={() => {}}
                    isDragging={true}
                  />
                )}
              </div>
            </SortableItem>
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  }
}

export default SequenceSurfaceWithSensors;