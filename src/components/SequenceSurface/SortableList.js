import React, { useState, useMemo, useEffect, useRef, useContext, useCallback } from 'react';
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
import SortableDropZone from './SortableDropzone.js';
import SortableItem from './SortableItem.js';
import AddStatement from '../AddStatement/AddStatement.js';
import { customKeyboardCoordinates } from './customKeyboardCoordinates.js';
import DraggableOverlay from './DraggableOverlay.js';
import { createEmptyUserInput } from '../../models/UserInput.js';
import { SequenceProcessContext } from '../../context/SequenceProcessContext.js';
import PropTypes from 'prop-types';

import './SortableList.css';

function SortableList({ params, onUserInputChange, collectExportValues, reset }) {
  const context = useContext(SequenceProcessContext);

  // Behaviour params
  const prepopulate = params.behaviour.prepopulate;
  const randomize = params.behaviour.randomizeStatements;
  const addStatementButton = params.behaviour.allowAddingOfStatements;

  // Content params
  const statementsFromParams = params.statementsList;
  const labelsFromParams = params.labelsList;

  // State
  const [activeId, setActiveId] = useState(null);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [autoEditStatementId, setAutoEditStatementId] = useState(null);
  const [stackedMode, setStackedMode] = useState(params.behaviour.useStackedView);
  const [tabIndex, setTabIndex] = useState(0);
  const [currentTabIndexElements, setCurrentTabIndexElements] = useState(0);
  const [currentElementsAriaDescendant, setCurrentElementsAriaDescendant] = useState(null);

  // Create refs for SortableItems
  const itemRefs = useRef({});

  // Initialize userInput state
  const [userInput, setUserInput] = useState(() => {
    const input = createEmptyUserInput();

    // Initialize labels with better null checking
    input.labels = Array.isArray(labelsFromParams)
      ? labelsFromParams.map((labelText) => ({
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
    return userInput.labels.map((label) => ({
      id: label.id,
      label: label.label
    }));
  }, [userInput.labels]);

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

  const [unassignedItemIds, setUnassignedItemIds] = useState(() => {
    return prepopulate ? [] : Object.keys(statements);
  });

  // Helper functions
  const isDropzoneGroup = (id) => dropzoneGroups.some((list) => list.id === id);

  const findListContainingItem = (itemId) => {
    if (unassignedItemIds.includes(itemId)) return 'unassignedItemIds';
    const list = dropzoneGroups.find((list) => list.items.includes(itemId));
    return list ? list.id : null;
  };

  const triggerResize = () => {
    setTimeout(() => {
      if (H5P && H5P.instances) {
        H5P.instances.forEach((instance) => {
          if (instance.trigger) {
            instance.trigger('resize');
          }
        });
      }
    }, 0);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event, args) => {
        return customKeyboardCoordinates(event, args, dropzoneGroups);
      }
    })
  );

  // Event handlers
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
      setUserInput((prev) => {
        const currentSequence = dropzoneGroups.reduce((acc, list) => {
          if (list.items[0]) {
            acc.push(list.items[0]);
          }
          return acc;
        }, []);

        const oldIndex = dropzoneGroups.findIndex((list) => list.id === active.id);
        const newIndex = dropzoneGroups.findIndex((list) => list.id === overId);
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

      setDropzoneGroups((lists) =>
        lists.map((list) => {
          if (list.id === overId) {
            if (list.items.length > 0) {
              setUnassignedItemIds((prevUnassignedItemIds) => [...prevUnassignedItemIds, list.items[0]]);

              setUserInput((prev) => ({
                ...prev,
                sequencedStatements: prev.sequencedStatements.filter((sid) => sid !== list.items[0])
              }));
            }
            return { ...list, items: [item] };
          }
          return list;
        })
      );

      setUnassignedItemIds((items) => items.filter((i) => i !== item));

      setUserInput((prev) => ({
        ...prev,
        sequencedStatements: [...prev.sequencedStatements, item]
      }));
    }
    else if (isDropzoneGroup(active.id)) {
      // Not commissioned yet: Dragging back to unassigned items list from dropzoneGroups
    }
    else {
      // Put dropped element at the bottom of unassigned items
      setUnassignedItemIds((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });

    }

    setActiveId(null);
    triggerResize();
  };

  const handleAddStatement = () => {
    const newId = H5P.createUUID();
    setUserInput((prev) => ({
      ...prev,
      statements: {
        ...prev.statements,
        [newId]: {
          touched: false,
          selectedLabels: [],
          comment: '',
          statement: context.translate('newStatement')
        }
      }
    }));
    setUnassignedItemIds((prevList) => [...prevList, newId]);
    setAutoEditStatementId(newId);
    triggerResize();
  };

  const handleRemove = (id) => {
    setUserInput((prev) => {
      const remainingStatements = { ...prev.statements };
      delete remainingStatements[id]; // Instead of using destructuring with an unused variable

      return {
        ...prev,
        sequencedStatements: prev.sequencedStatements.filter((sid) => sid !== id),
        statements: remainingStatements
      };
    });

    setUnassignedItemIds((prev) => prev.filter((itemId) => itemId !== id));
    triggerResize();
  };

  const handleStatementChange = (id, newContent) => {
    setUserInput((prev) => ({
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

  const handleElemntReceivedFocus = (itemId) => {
    setCurrentElementsAriaDescendant(itemId);
  };

  const handleLabelChange = (statementId, labelId) => {
    setUserInput((prev) => ({
      ...prev,
      statements: {
        ...prev.statements,
        [statementId]: {
          ...prev.statements[statementId],
          selectedLabels: prev.statements[statementId].selectedLabels.includes(labelId)
            ? prev.statements[statementId].selectedLabels.filter((id) => id !== labelId)
            : [...prev.statements[statementId].selectedLabels, labelId]
        }
      }
    }));
  };

  const handleCommentClick = (itemId) => {
    setActiveCommentId((prevId) => (prevId === itemId ? null : itemId));
  };

  const handleCommentChange = (itemId, newComment) => {
    setUserInput((prev) => ({
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

  /**
   * Focus the item at the given index in the unassigned items list
   * @param {number} index Index of the item to focus
   * @returns {boolean} True if the item was focused, false if index was out of bounds
   */
  const focusItemAt = useCallback((index) => {
    if (index < 0 || index >= unassignedItemIds.length) {
      return false;
    }

    const id = unassignedItemIds[index];
    itemRefs.current[id]?.focus?.();

    return true;
  }, [unassignedItemIds]);

  /**
   * Handle keyboard navigation within the unassigned items list
   * @param {KeyboardEvent} event Keyboard event
   */
  const handleKeyDown = useCallback((event) => {
    const { key } = event;

    const length = unassignedItemIds.length;
    if (length === 0) {
      return;
    }

    let nextIndex = currentTabIndexElements;

    switch (key) {
      case 'ArrowDown':
        nextIndex = Math.min(currentTabIndexElements + 1, length - 1);
        break;
      case 'ArrowUp':
        nextIndex = Math.max(currentTabIndexElements - 1, 0);
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = length - 1;
        break;
      default:
        return; // Unhandled key
    }

    if (nextIndex === currentTabIndexElements) {
      event.preventDefault();
      return;
    }

    setCurrentTabIndexElements(nextIndex);
    focusItemAt(nextIndex);
    event.preventDefault();
  }, [currentTabIndexElements, unassignedItemIds.length, focusItemAt]);

  // Helper function to create initial statements
  const createInitialStatements = () => {
    const statements = {};
    statementsFromParams.forEach((statementText) => {
      const id = H5P.createUUID();
      statements[id] = {
        touched: false,
        selectedLabels: [],
        comment: '',
        statement: statementText
      };
    });
    return statements;
  };

  // Helper function to create initial labels
  const createInitialLabels = () => {
    return Array.isArray(labelsFromParams) ?
      labelsFromParams.map((labelText) => ({
        id: H5P.createUUID(),
        label: labelText
      })) :
      [];
  };

  // Helper function to create initial dropzone groups
  const createInitialDropzoneGroups = (statementIds, labelIds) => {
    const statementsLength = statementsFromParams?.length || 0;
    let prepopulatedStatementIds = [...statementIds];

    if (prepopulate && randomize) {
      prepopulatedStatementIds = prepopulatedStatementIds.sort(() => Math.random() - 0.5);
    }

    return Array.from({ length: statementsLength }, (_, index) => ({
      id: `dropzone-${index + 1}`,
      items: prepopulate ? [prepopulatedStatementIds[index]] : [],
      labelId: labelIds[index]
    }));
  };

  // Effects
  useEffect(() => {
    const assignedItems = dropzoneGroups.flatMap((group) => group.items);
    setUnassignedItemIds(Object.keys(statements).filter((id) => !assignedItems.includes(id)));
  }, [dropzoneGroups, statements]);

  // Keep currentTabIndexElements within bounds when the list size changes
  useEffect(() => {
    setCurrentTabIndexElements((idx) => {
      if (unassignedItemIds.length === 0) {
        return 0;
      }
      return Math.min(Math.max(idx, 0), unassignedItemIds.length - 1);
    });
  }, [unassignedItemIds]);

  useEffect(() => {
    if (onUserInputChange) {
      const currentSequence = dropzoneGroups.reduce((acc, list) => {
        if (list.items[0]) {
          acc.push(list.items[0]);
        }
        return acc;
      }, []);

      const updatedUserInput = {
        ...userInput,
        sequencedStatements: currentSequence
      };

      onUserInputChange(updatedUserInput);
    }
  }, [userInput, dropzoneGroups, onUserInputChange]);

  useEffect(() => {
    if (collectExportValues) {
      collectExportValues('userInput', () => ({
        labels: labels,
        statements: userInput.statements,
        sequencedStatements: userInput.sequencedStatements,
      }));
    }

    return () => {
      if (collectExportValues) {
        collectExportValues('userInput', () => ({}));
      }
    };
  }, [collectExportValues, userInput, labels]);

  useEffect(() => {
    if (autoEditStatementId && itemRefs.current[autoEditStatementId]) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        itemRefs.current[autoEditStatementId]?.enterEditMode();
        setAutoEditStatementId(null);
      }, 100);
    }
  }, [autoEditStatementId, unassignedItemIds]);

  reset(() => {
    // Reset userInput to initial state
    const initialUserInput = createEmptyUserInput();
    initialUserInput.labels = createInitialLabels();
    initialUserInput.statements = createInitialStatements();

    setUserInput(initialUserInput);

    // Reset dropzone groups to initial state
    const statementIds = Object.keys(initialUserInput.statements);
    const labelIds = Object.keys(initialUserInput.labels);
    const initialDropzoneGroups = createInitialDropzoneGroups(statementIds, labelIds);

    setDropzoneGroups(initialDropzoneGroups);

    // Reset unassigned items
    setUnassignedItemIds(prepopulate ? [] : statementIds);

    // Reset UI state
    setActiveId(null);
    setActiveCommentId(null);
    setAutoEditStatementId(null);

    // Clear refs and trigger resize
    itemRefs.current = {};
    triggerResize();
  });

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
          <SortableContext items={dropzoneGroups.map((list) => list.id)} strategy={verticalListSortingStrategy}>
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
          <ul
            className={`h5p-sequence-column ${stackedMode ? 'stacked-mode' : ''}`}
            onKeyDown={handleKeyDown}
            role={'listbox'}
            tabIndex={tabIndex}
            aria-label={context.translate('unassignedStatementsList')}
            aria-activedescendant={currentElementsAriaDescendant}
            onFocus={(event) => {
              if (event.target !== event.currentTarget) {
                return;
              }

              focusItemAt(currentTabIndexElements);
              setTabIndex(-1);
            }}
            onBlur={() => {
              setTabIndex(0);
            }}
          >
            {unassignedItemIds.map((itemId, index) => (
              <SortableItem
                key={itemId}
                ref={(ref) => {
                  if (ref) {
                    itemRefs.current[itemId] = ref;
                  }
                  else {
                    delete itemRefs.current[itemId];
                  }
                }}
                itemId={itemId}
                statement={statements[itemId].content}
                onStatementDelete={handleRemove}
                onStatementChange={handleStatementChange}
                enableEditing={addStatementButton}
                listId='unassignedItemIds'
                allowDelete={addStatementButton}
                stackedMode={stackedMode}
                stackIndex={index}
                totalItems={unassignedItemIds.length}
                isTabbable={currentTabIndexElements === index}
                onReceivedFocus={handleElemntReceivedFocus}
              />
            ))}
            {addStatementButton && (
              <AddStatement
                addStatement={handleAddStatement}
              />
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
          </ul>
        </div>
      )}
    </DndContext>
  );
}

SortableList.propTypes = {
  params: PropTypes.object.isRequired,
  onUserInputChange: PropTypes.func,
  collectExportValues: PropTypes.func,
  reset: PropTypes.func.isRequired,
};

export default SortableList;
