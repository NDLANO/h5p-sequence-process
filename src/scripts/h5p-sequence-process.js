import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from '@components/Main.js';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';
import { sanitizeParams } from '@services/utils.js';
import { getSemanticsDefaults } from '@services/h5p-util.js';

// TODO: Fix focus of textarea in comment popover
// TODO: Fix export
// TODO: Remove custom font and use FontAwesome
// TODO: Fix pre-populated sorting

export default class SequenceProcess extends H5P.EventDispatcher {
  constructor(params, contentId, extras = {}) {
    super();

    this.params = sanitizeParams(params);
    this.contentId = contentId;

    this.language = extras.metadata?.defaultLanguage || 'en';

    this.container;
    this.behaviour = this.params.behaviour || {};
    this.resetStack = [];
    this.collectExportValuesStack = [];
    this.wrapper = null;
    this.activityStartTime = new Date();
    this.activeBreakpoints = [];
    this.currentRatio = null;

    const semanticsDefaults = getSemanticsDefaults();
    this.translations = {
      ...(semanticsDefaults.accessibility || {}),
      ...(semanticsDefaults.l10n || {}),
      ...(semanticsDefaults.resourceReport || {}),
      ...(this.params.accessibility || {}),
      ...(this.params.l10n || {}),
      ...(this.params.resourceReport || {})
    };

    // Required because these functions are uses without context
    this.getRect = this.getRect.bind(this);
    this.registerReset = this.registerReset.bind(this);
    this.collectExportValues = this.collectExportValues.bind(this);
    this.translate = this.translate.bind(this);
  }

  collectExportValues(index, callback) {
    if (typeof index !== 'undefined') {
      this.collectExportValuesStack.push({ key: index, callback: callback });
    }
    else {
      const exportValues = {};
      this.collectExportValuesStack.forEach(({ key, callback }) => exportValues[key] = callback());
      return exportValues;
    }
  }

  registerReset(callback) {
    this.resetStack.push(callback);
  }

  attach($container) {
    if (!this.wrapper) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('h5p-sequence-wrapper');
      this.wrapper = wrapper;

      const root = createRoot(this.wrapper);
      root.render(
        <SequenceProcessContext.Provider value={this}>
          <Main
            {...this.params}
            id={this.contentId}
            language={this.language}
            collectExportValues={this.collectExportValues}
          />
        </SequenceProcessContext.Provider>
      );
    }

    // Append elements to DOM
    this.container = $container[0];
    this.container.appendChild(this.wrapper);
    this.container.classList.add('h5p-sequence-process');
  }

  getRect() {
    return this.wrapper.getBoundingClientRect();
  }

  reset() {
    this.resetStack.forEach((callback) => callback());
  }

  /**
   * Help fetch the correct translations.
   * @param {string} key Key of the translation.
   * @param {object} vars Variables to replace in the translation.
   * @returns {string} The translated string.
   */
  translate(key, vars) {
    const template = this.translations?.[key] ?? key;
    if (!vars || typeof vars !== 'object') {
      return template;
    }

    let text = template;
    for (const [placeholder, value] of Object.entries(vars)) {
      text = text.split(placeholder).join(value ?? '');
    }

    return text;
  }
}
