/**
 * Determines if the H5P content is being interacted with using a mouse.
 * @returns {boolean} True if using mouse, false otherwise.
 */
export const isUsingMouse = () => {
  return document.querySelector('.h5p-content')?.classList.contains('using-mouse');
};
