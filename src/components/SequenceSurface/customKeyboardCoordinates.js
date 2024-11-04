import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export const customKeyboardCoordinates = (event, args) => {
  const coordinates = sortableKeyboardCoordinates(event, args);
  
  const overElement = args.context.over?.id;
  const isOverDropzone = overElement?.toString().startsWith('dropzone-');
  
  console.log('Keyboard Movement:', {
    key: event.key,
    overElement,
    isOverDropzone,
    coordinates
  });

  // If not over a dropzone, only allow left moves
  if (!isOverDropzone && event.key !== 'ArrowLeft') {
    console.log('Blocking non-left move when not over dropzone');
    return undefined;
  }

  // If over dropzone-1, block up moves
  if (overElement === 'dropzone-1' && event.key === 'ArrowUp') {
    console.log('Blocking up move in dropzone-1');
    return undefined;
  }
  
  return coordinates;
};