import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export const customKeyboardCoordinates = (event, args) => {
  const coordinates = sortableKeyboardCoordinates(event, args);
  
  const overElement = args.context.over?.id;
  const isOverDropzone = overElement?.toString().startsWith('dropzone-');
  
  // If not over a dropzone, only allow left moves
  if (!isOverDropzone && event.key !== 'ArrowLeft') {
    return undefined;
  }

  // If over dropzone-1, block up moves
  if (overElement === 'dropzone-1' && event.key === 'ArrowUp') {
    return undefined;
  }
  
  return coordinates;
};