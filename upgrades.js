var H5PUpgrades = H5PUpgrades || {};

/**
 * Upgrades for the Game Map content type.
 */
H5PUpgrades['H5P.SequenceProcess'] = (() => {
  return {
    1: {
      /**
       * Asynchronous content upgrade hook.
       * Introduces the mode parameter.
       * Removes old parameter.
       * @param {object} parameters Content parameters.
       * @param {function} finished Callback when finished.
       * @param {object} extras Extra parameters such as metadata, etc.
       */
      4: (parameters, finished, extras) => {

        if (parameters?.behaviour) {
          delete parameters.behaviour.displayCommentsBelowStatement;

          parameters.mode = (parameters.behaviour.prioritizeable) ? 'priority' : 'sequence';
          delete parameters.behaviour.prioritizeable;
        }

        finished(null, parameters, extras);
      },
      /**
       * Asynchronous content upgrade hook.
       * Rearrange for editor widget and add dropzones.
       * Migrate "Priority" mode contents.
       * @param {object} parameters Content parameters.
       * @param {function} finished Callback when finished.
       * @param {object} extras Extra parameters such as metadata, etc.
       */
      7: (parameters, finished, extras) => {
        if (parameters) {
          const statementsCount = parameters.statementsList?.length || 0;
          parameters.dropzonesList = [];
          for (let i = 0; i < statementsCount; i++) {
            parameters.dropzonesList.push({ enumeration: {} });
          }

          if (parameters.mode === 'priority') {
            parameters.dropzonesList = parameters.dropzonesList.map((dropzone, index) => {
              dropzone.showEnumeration = true;
              dropzone.enumeration = { enumeration: `${index + 1}` };

              if (index === 0) {
                dropzone.enumeration.backgroundColor = '#517aa4';
              }

              if (index === 1) {
                dropzone.enumeration.backgroundColor = '#486e93';
              }

              if (index === 2) {
                dropzone.enumeration.backgroundColor = '#406182';
              }

              return dropzone;
            });
          }

          delete parameters.mode;

          parameters = { sequenceProcess: parameters };
        }

        finished(null, parameters, extras);
      },
    }
  };
})();
