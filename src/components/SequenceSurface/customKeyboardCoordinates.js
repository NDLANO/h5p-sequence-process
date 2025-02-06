import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export const customKeyboardCoordinates = (event, args, dropzoneGroups) => {
  const coordinates = sortableKeyboardCoordinates(event, args);

  const overElement = args.context.over?.id;
  const isOverDropzone = overElement?.toString().startsWith('dropzone-');

  // If not over a dropzone, only allow left moves
  if (!isOverDropzone && event.key !== 'ArrowLeft') {
    return undefined;
  }

  if (isOverDropzone && dropzoneGroups[0]?.id === overElement && event.key === 'ArrowUp') {
    return undefined;
  }
  return coordinates;
};