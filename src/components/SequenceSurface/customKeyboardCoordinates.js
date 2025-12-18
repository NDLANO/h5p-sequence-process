import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export const customKeyboardCoordinates = (event, args, dropzoneGroups) => {
  const overId = args.context.over?.id;
  const isOverDropzone = dropzoneGroups.some((dropzone) => dropzone.id === overId);

  if (!isOverDropzone && event.key !== 'ArrowLeft') {
    return;
  }

  if (isOverDropzone) {
    if (event.key === 'ArrowUp' && dropzoneGroups[0]?.id === overId) {
      return;
    }

    if (event.key === 'ArrowDown' && dropzoneGroups[dropzoneGroups.length - 1]?.id === overId) {
      return;
    }
  }

  return sortableKeyboardCoordinates(event, args);
};
