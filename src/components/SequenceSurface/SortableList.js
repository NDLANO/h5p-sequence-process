import React, { useState, useMemo, useEffect } from 'react';
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
import { createEmptyUserInput } from '../../models/UserInput';

function SortableList({ params, onUserInputChange, collectExportValues }) {
  // Behaviour params
  const prepopulate = params.behaviour.prepopulate;
  const randomize = params.behaviour.randomizeStatements;
  const addStatementButton = params.behaviour.allowAddingOfStatements;

  // Content params
  const statementsFromParams = params.statementsList;
  const labelsFromParams = params.labelsList;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event, args) => {
        return customKeyboardCoordinates(event, args, dropzoneGroups);
      }
    })
  );

  // State
  const [activeId, setActiveId] = useState(null);
  const [activeCommentId, setActiveCommentId] = useState(null);

  // Initialize userInput state
  const [userInput, setUserInput] = useState(() => {
    const input = createEmptyUserInput();

    // Initialize labels with better null checking
    input.labels = Array.isArray(labelsFromParams)
      ? labelsFromParams.map(labelText => ({
        id: H5P.createUUID(),
        label: labelText
      }))
      : [];

    // Initialize statements
    statementsFromParams.forEach((statementText) => {
      const id = H5P.createUUID();
      input.statements[id] = {
        touched: false,
        selectedLabels: [],
        comment: '',
        statement: statementText
      };
    });

    return input;
  });

  // Replace existing statements and labels state with derived state from userInput
  const statements = useMemo(() => {
    return Object.entries(userInput.statements).reduce((acc, [id, statement]) => {
      acc[id] = {
        id,
        content: statement.statement
      };
      return acc;
    }, {});
  }, [userInput.statements]);

  const labels = useMemo(() => {
    return userInput.labels.map(label => ({
      id: label.id,
      label: label.label
    }));
  }, [userInput.labels]);

  const [unassignedItemIds, setUnassignedItemIds] = useState(() => {
    return prepopulate ? [] : Object.keys(statements);
  });

  const [dropzoneGroups, setDropzoneGroups] = useState(() => {
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

  useEffect(() => {
    // Ensure unassignedItemIds stays in sync
    const assignedItems = dropzoneGroups.flatMap(group => group.items);
    setUnassignedItemIds(Object.keys(statements).filter(id => !assignedItems.includes(id)));
  }, [dropzoneGroups, statements]);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      triggerResize();
      return;
    }

    const activeList = findListContainingItem(active.id);
    const overId = over.id;

    // If dragging a container to reorder among containers
    if (isDropzoneGroup(active.id) && isDropzoneGroup(overId)) {
      setDropzoneGroups((prevLists) => {
        const oldIndex = prevLists.findIndex((list) => list.id === active.id);
        const newIndex = prevLists.findIndex((list) => list.id === overId);
        return arrayMove(prevLists, oldIndex, newIndex);
      });

      // Update the sequenced statements to match the new container order
      setUserInput(prev => {
        const currentSequence = dropzoneGroups.reduce((acc, list) => {
          if (list.items[0]) {
            acc.push(list.items[0]);
          }
          return acc;
        }, []);

        // Find the items being reordered
        const oldIndex = dropzoneGroups.findIndex(list => list.id === active.id);
        const newIndex = dropzoneGroups.findIndex(list => list.id === overId);

        // Reorder the sequence to match the new container order
        const newSequence = arrayMove([...currentSequence], oldIndex, newIndex);

        return {
          ...prev,
          sequencedStatements: newSequence
        };
      });
    }

    // If dragging an item from unassignedItemIds to a container in column2
    else if (activeList === 'unassignedItemIds' && isDropzoneGroup(overId)) {
      const item = active.id;

      // Replace item in target drop zone if it's already occupied
      setDropzoneGroups((lists) =>
        lists.map((list) => {
          if (list.id === overId) {
            if (list.items.length > 0) {
              // If target is occupied, move existing item back to unassignedItemIds
              setUnassignedItemIds((prevUnassignedItemIds) => [...prevUnassignedItemIds, list.items[0]]);

              // Remove item from sequencedStatements
              setUserInput(prev => {
                const updatedUserInput = {
                  ...prev,
                  sequencedStatements: prev.sequencedStatements.filter(sid => sid !== list.items[0])
                };
                return updatedUserInput;
              });
            }
            // Set the new item in the target drop zone
            return { ...list, items: [item] };
          }
          return list;
        })
      );

      // Remove the dragged item from unassignedItemIds
      setUnassignedItemIds((items) => items.filter((i) => i !== item));

      setUserInput(prev => {
        return {
          ...prev,
          sequencedStatements: [...prev.sequencedStatements, item]
        };
      });
    }

    setActiveId(null);
    triggerResize();
  };

  // Update handlers to modify userInput
  const handleAddStatement = () => {
    const newId = H5P.createUUID();
    setUserInput(prev => ({
      ...prev,
      statements: {
        ...prev.statements,
        [newId]: {
          touched: false,
          selectedLabels: [],
          comment: '',
          statement: 'New Statement'
        }
      }
    }));
    setUnassignedItemIds(prevList => [...prevList, newId]);
    triggerResize();
  };

  const handleRemove = (id) => {
    setUserInput(prev => {
      const { [id]: removed, ...remainingStatements } = prev.statements;
      return {
        ...prev,
        sequencedStatements: prev.sequencedStatements.filter(sid => sid !== id),
        statements: remainingStatements
      };
    });
    setUnassignedItemIds(prev => prev.filter(itemId => itemId !== id));
    triggerResize();
  };

  const handleStatementChange = (id, newContent) => {
    setUserInput(prev => ({
      ...prev,
      statements: {
        ...prev.statements,
        [id]: {
          ...prev.statements[id],
          statement: newContent
        }
      }
    }));
  };

  const handleLabelChange = (statementId, labelId) => {
    setUserInput(prev => ({
      ...prev,
      statements: {
        ...prev.statements,
        [statementId]: {
          ...prev.statements[statementId],
          selectedLabels: prev.statements[statementId].selectedLabels.includes(labelId)
            ? prev.statements[statementId].selectedLabels.filter(id => id !== labelId)
            : [...prev.statements[statementId].selectedLabels, labelId]
        }
      }
    }));
  };

  const handleCommentClick = (itemId) => {
    setActiveCommentId((prevId) => (prevId === itemId ? null : itemId));
  };

  const handleCommentChange = (itemId, newComment) => {
    setUserInput(prev => ({
      ...prev,
      statements: {
        ...prev.statements,
        [itemId]: {
          ...prev.statements[itemId],
          comment: newComment
        }
      }
    }));
  };

  // Add useEffect to watch userInput changes
  useEffect(() => {
    if (onUserInputChange) {
      // Get the current sequence from dropzoneGroups
      const currentSequence = dropzoneGroups.reduce((acc, list) => {
        if (list.items[0]) {
          acc.push(list.items[0]);
        }
        return acc;
      }, []);

      // Update sequencedStatements in userInput
      const updatedUserInput = {
        ...userInput,
        sequencedStatements: currentSequence
      };

      onUserInputChange(updatedUserInput);
    }
  }, [userInput, dropzoneGroups, onUserInputChange]);

  useEffect(() => {
    if (collectExportValues) {
      collectExportValues('userInput', () => {
        return {
          labels: labels,
          statements: userInput.statements,
          sequencedStatements: userInput.sequencedStatements,
        };
      });
    }

    return () => {
      // Cleanup function (optional, depends on context handling)
      if (collectExportValues) {
        collectExportValues('userInput', () => { });
      }
    };
  }, [collectExportValues, userInput]);

  const isDropzoneGroup = (id) => dropzoneGroups.some((list) => list.id === id);

  const findListContainingItem = (itemId) => {
    if (unassignedItemIds.includes(itemId)) return 'unassignedItemIds';
    const list = dropzoneGroups.find((list) => list.items.includes(itemId));
    return list ? list.id : null;
  };

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

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      accessibility={{
        onDragStart: ({ active }) => `Picked up ${active.id}.`,
        onDragOver: ({ over }) => `Moving over ${over.id}.`,
      }}
    >
      <div className='h5p-sequence-dropzone'>
        <div className="h5p-sequence-column">
          <SortableContext items={dropzoneGroups.map(list => list.id)} strategy={verticalListSortingStrategy}>
            {dropzoneGroups.map((list, index) => (
              <SortableDropZone
                key={list.id}
                index={index}
                id={list.id}
                items={list.items}
                isUnassignedEmpty={unassignedItemIds.length === 0}
                labels={labels}
                statements={statements}
                onLabelSelect={handleLabelChange}
                selectedLabels={list.items[0] ? userInput.statements[list.items[0]].selectedLabels : []}
                comment={list.items[0] ? userInput.statements[list.items[0]].comment : ''}
                activeCommentId={activeCommentId}
                onCommentClick={handleCommentClick}
                onCommentChange={(newComment) => handleCommentChange(list.items[0], newComment)}
              />
            ))}
          </SortableContext>
        </div>
      </div>

      {unassignedItemIds.length > 0 && (
        <div className='h5p-sequence-select-list'>
          <div className="h5p-sequence-column">
            {unassignedItemIds.map((itemId) => (
              <SortableItem
                key={itemId}
                itemId={itemId}
                statement={statements[itemId].content}
                onStatementDelete={handleRemove}
                onStatementChange={handleStatementChange}
                enableEditing={addStatementButton}
                listId='unassignedItemIds'
                allowDelete={addStatementButton}
              />
            ))}
            {addStatementButton && (
              <AddStatement
                addStatement={handleAddStatement}
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
            dropzoneGroups={dropzoneGroups}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default SortableList;
