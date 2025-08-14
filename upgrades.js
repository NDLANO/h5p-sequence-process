var H5PUpgrades = H5PUpgrades || {};

/**
 * Upgrades for the Game Map content type.
 */
H5PUpgrades['H5P.SequenceProcess'] = (() => {
  return {
    1: {
      /**
       * Asynchronous content upgrade hook.
       * Removes old parameter.
       * @param {object} parameters Content parameters.
       * @param {function} finished Callback when finished.
       * @param {object} extras Extra parameters such as metadata, etc.
       */
      4: (parameters, finished, extras) => {

        if (parameters?.behaviour) {
          delete parameters.behaviour.displayCommentsBelowStatement;
        }

        finished(null, parameters, extras);
      },
    }
  };
})();
