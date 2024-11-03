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
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Comment from '../Actions/Comment';
import SortableDropZone from './SortableDropzone';

function SortableItem({ itemId }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: itemId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative',
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div className="h5p-sequence-draggable-container">
      <div
        ref={setNodeRef}
        className="h5p-sequence-draggable-element"
        style={style}
        {...attributes}
        {...listeners}
        tabIndex={0}
      >
        <div className="h5p-sequence-statement">
          <div className="h5p-sequence-statement-remaining">
            <div className="h5p-sequence-drag-element">
              <span className="h5p-ri hri-move" data-no-dnd="true" />
            </div>
            <p className="h5p-sequence-element">{itemId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// DraggableOverlay now reuses SortableItem to match the appearance of Column 1 items
function DraggableOverlay({ id }) {
  return <SortableItem itemId={id} />;
}

function App({ params }) {
  console.log('params', params);
  const statements = params.statementsList; // it is always params.statementsList
  const labelsFromParams = params.labelsList;
  const labels = labelsFromParams.map((label) => {
    return {
      id: H5P.createUUID(),
      label,
    };
  });
  
  const [list1, setList1] = useState(statements || []);
  const [column2Lists, setColumn2Lists] = useState(() => {
    // Create dropzones based on the original statements length
    const statementsLength = statements?.length || 0;
    return Array.from({ length: statementsLength }, (_, index) => ({
      id: `dropzone-${index + 1}`,
      items: []
    }));
  });
  const [activeId, setActiveId] = useState(null);
  const [activeContainer, setActiveContainer] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
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
  };

  const findListContainingItem = (itemId) => {
    if (list1.includes(itemId)) return 'list1';
    const list = column2Lists.find((list) => list.items.includes(itemId));
    return list ? list.id : null;
  };

  const isColumn2Container = (id) => column2Lists.some((list) => list.id === id);

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
                isList1Empty={list1.length === 0} // Pass isList1Empty prop
                labels={labels}
              />
            ))}
          </SortableContext>
        </div>
      </div>

      {list1.length > 0 && (
        <div className="h5p-sequence-column h5p-sequence-select-list">
          <SortableContext items={list1} strategy={verticalListSortingStrategy}>
            {list1.map((itemId) => (
              <SortableItem key={itemId} itemId={itemId} />
            ))}
          </SortableContext>
        </div>
      )}

      <DragOverlay>
        {activeId ? <DraggableOverlay id={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
