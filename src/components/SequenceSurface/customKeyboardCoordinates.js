import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export const customKeyboardCoordinates = (event, args, column2Lists) => {
  const coordinates = sortableKeyboardCoordinates(event, args);
  
  const overElement = args.context.over?.id;
  const isOverDropzone = overElement?.toString().startsWith('dropzone-');
  
  // If not over a dropzone, only allow left moves
  if (!isOverDropzone && event.key !== 'ArrowLeft') {
    return undefined;
  }
  
  console.log('Top dropzone ID in keyboard coordinates:', column2Lists[0]?.id);
  if (isOverDropzone && column2Lists[0]?.id === overElement && event.key === 'ArrowUp') {
    return undefined;
  }
  return coordinates;
};