import React, { useState, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableDropZone from './SortableDropzone';
import SortableItem from './SortableItem';
import AddStatement from '../AddStatement/AddStatement';
import { customKeyboardCoordinates } from './customKeyboardCoordinates';
import DraggableOverlay from './DraggableOverlay';

function App({ params, translations }) {
  // Behaviour params
  const prepopulate = params.behaviour.prepopulate;
  const randomize = params.behaviour.randomizeStatements;
  const addStatementButton = params.behaviour.allowAddingOfStatements;

  // Content params
  // statementsFromParams is an array of strings: ["statement 1", "statement 2", ...]
  // labelsFromParams is an array of strings: ["label 1", "label 2", ...]
  const statementsFromParams = params.statementsList;
  const labelsFromParams = params.labelsList;

  // Convert string statements into objects with IDs
  const [statements, setStatements] = useState(() => {
    return statementsFromParams.reduce((acc, statementText, index) => {
      const id = H5P.createUUID();
      acc[id] = {
        id,
        content: statementText
      };
      return acc;
    }, {});
  });

  // Add console.log to debug
  console.log('labelsFromParams:', labelsFromParams);
  
  const [labels, setLabels] = useState(() => {
    return labelsFromParams.map(labelText => ({
      id: H5P.createUUID(),
      content: labelText
    }));
  });

  // Add another console.log after state initialization
  console.log('Current labels state:', labels);

  // list1 and column2Lists store only the IDs
  const [list1, setList1] = useState(() => {
    return prepopulate ? [] : Object.keys(statements);
  });
  const [column2Lists, setColumn2Lists] = useState(() => {
    const statementsLength = statementsFromParams?.length || 0;
    
    let prepopulatedStatementIds = Object.keys(statements);
    if (prepopulate && randomize) {
      prepopulatedStatementIds = [...prepopulatedStatementIds].sort(() => Math.random() - 0.5);
    }

    const labelIds = Object.keys(labels);
    return Array.from({ length: statementsLength }, (_, index) => ({
      id: `dropzone-${index + 1}`,
      items: prepopulate ? [prepopulatedStatementIds[index]] : [],
      labelId: labelIds[index]
    }));
  });
  const [activeId, setActiveId] = useState(null);
  const [activeContainer, setActiveContainer] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: customKeyboardCoordinates })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    const draggedContainer = column2Lists.find(list => list.id === active.id);
    if (draggedContainer) setActiveContainer(draggedContainer);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      setActiveContainer(null);
      triggerResize();
      return;
    }

    const activeList = findListContainingItem(active.id);
    const overId = over.id;

    // If dragging a container to reorder among containers
    if (isColumn2Container(active.id) && isColumn2Container(overId)) {
      setColumn2Lists((prevLists) => {
        const oldIndex = prevLists.findIndex((list) => list.id === active.id);
        const newIndex = prevLists.findIndex((list) => list.id === overId);
        return arrayMove(prevLists, oldIndex, newIndex);
      });
    }
    // If dragging an item from list1 to a container in column2
    else if (activeList === 'list1' && isColumn2Container(overId)) {
      const item = active.id;
      
      // Replace item in target drop zone if it's already occupied
      setColumn2Lists((lists) =>
        lists.map((list) => {
          if (list.id === overId) {
            if (list.items.length > 0) {
              // If target is occupied, move existing item back to list1
              setList1((prevList1) => [...prevList1, list.items[0]]);
            }
            // Set the new item in the target drop zone
            return { ...list, items: [item] };
          }
          return list;
        })
      );

      // Remove the dragged item from list1
      setList1((items) => items.filter((i) => i !== item));
    }

    setActiveId(null);
    setActiveContainer(null);
    triggerResize();
  };

  const findListContainingItem = (itemId) => {
    if (list1.includes(itemId)) return 'list1';
    const list = column2Lists.find((list) => list.items.includes(itemId));
    return list ? list.id : null;
  };

  const isColumn2Container = (id) => column2Lists.some((list) => list.id === id);

  const triggerResize = () => {
    setTimeout(() => {
      if (H5P && H5P.instances) {
        H5P.instances.forEach(instance => {
          if (instance.trigger) {
            instance.trigger('resize');
          }
        });
      }
    }, 0);
  };

  const handleAddStatement = () => {
    const newId = H5P.createUUID();
    const newStatement = {
      id: newId,
      content: 'New Statement'
    };
    
    setStatements(prev => ({
      ...prev,
      [newId]: newStatement
    }));

    setList1(prevList => [...prevList, newId]);
    triggerResize();
  };

  const handleRemove = (id) => {
    console.log('handleRemove', id);
    setStatements(prev => {
      const newStatements = { ...prev };
      delete newStatements[id];
      return newStatements;
    });

    setList1(prev => prev.filter(itemId => itemId !== id));
    triggerResize();
  };

  const handleStatementChange = (id, newContent) => {
    setStatements(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        content: newContent
      }
    }));
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className='h5p-sequence-dropzone'>
        <div className="h5p-sequence-column">
          <SortableContext items={column2Lists.map(list => list.id)} strategy={verticalListSortingStrategy}>
            {column2Lists.map((list) => (
              <SortableDropZone 
                key={list.id} 
                id={list.id} 
                items={list.items} 
                isList1Empty={list1.length === 0}
                labels={labels}
                statements={statements}
              />
            ))}
          </SortableContext>
        </div>
      </div>

      {list1.length > 0 && (
        <div className='h5p-sequence-select-list'>
        <div className="h5p-sequence-column">
          {list1.map((itemId) => (
            <SortableItem 
              key={itemId} 
              itemId={itemId} 
              statement={statements[itemId].content}
              onStatementDelete={handleRemove}
              onStatementChange={handleStatementChange}
              enableEditing={addStatementButton}
              listId='list1'
              allowDelete={addStatementButton}
            />
          ))}
          {addStatementButton && (
            <AddStatement 
              onClick={handleAddStatement} 
            />
          )}
        </div>
        </div>
      )}

      <DragOverlay>
        {activeId ? (
          <DraggableOverlay 
            id={activeId} 
            statements={statements} 
            column2Lists={column2Lists}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
