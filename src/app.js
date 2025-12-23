import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './components/Main.js';
import { SequenceProcessContext } from './context/SequenceProcessContext.js';
import { breakpoints, getRatio, sanitizeParams } from './components/utils.js';
import { getSemanticsDefaults } from '@services/h5p-util.js';

// Load library
H5P.SequenceProcess = (function () {

  function Wrapper(params, contentId, extras = {}) {
    // Initialize event inheritance
    H5P.EventDispatcher.call(this);

    this.language = extras.metadata?.defaultLanguage || 'en';

    let container;
    this.params = sanitizeParams(params);
    this.behaviour = this.params.behaviour || {};
    this.resetStack = [];
    this.collectExportValuesStack = [];
    this.wrapper = null;
    this.id = contentId;
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

    const createElements = () => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('h5p-sequence-wrapper');
      this.wrapper = wrapper;

      const root = createRoot(this.wrapper);
      root.render(
        <SequenceProcessContext.Provider value={this}>
          <Main
            {...this.params}
            id={contentId}
            language={this.language}
            collectExportValues={this.collectExportValues}
          />
        </SequenceProcessContext.Provider>
      );
    };

    this.collectExportValues = (index, callback) => {
      if (typeof index !== 'undefined') {
        this.collectExportValuesStack.push({ key: index, callback: callback });
      }
      else {
        const exportValues = {};
        this.collectExportValuesStack.forEach(({ key, callback }) => exportValues[key] = callback());
        return exportValues;
      }
    };

    this.registerReset = (callback) => this.resetStack.push(callback);

    this.attach = ($container) => {
      if (!this.wrapper) {
        createElements();
      }

      // Append elements to DOM
      $container[0].appendChild(this.wrapper);
      $container[0].classList.add('h5p-sequence-process');
      container = $container[0];
    };

    this.getRect = () => {
      return this.wrapper.getBoundingClientRect();
    };

    this.reset = () => {
      this.resetStack.forEach((callback) => callback());
    };

    /**
     * Set css classes based on ratio available to the container
     *
     * @param wrapper
     * @param ratio
     */
    this.addBreakPoints = (wrapper, ratio = getRatio(container)) => {
      if (ratio === this.currentRatio) {
        return;
      }
      this.activeBreakpoints = [];
      breakpoints().forEach((item) => {
        if (item.shouldAdd(ratio)) {
          wrapper.classList.add(item.className);
          this.activeBreakpoints.push(item.className);
        }
        else {
          wrapper.classList.remove(item.className);
        }
      });
      this.currentRatio = ratio;
    };

    this.resize = () => {
      if (!this.wrapper) {
        return;
      }
      this.addBreakPoints(this.wrapper);
    };

    /**
     * Help fetch the correct translations.
     *
     * @params key
     * @params vars
     * @return {string}
     */
    this.translate = (key, vars) => {
      let translation = this.translations[key];
      if (vars !== undefined && vars !== null) {
        translation = Object
          .keys(vars)
          .map((key) => translation.replace(key, vars[key]))
          .toString();
      }
      return translation;
    };

    this.getRect = this.getRect.bind(this);
    this.resize = this.resize.bind(this);
    this.on('resize', this.resize);
  }

  // Inherit prototype properties
  Wrapper.prototype = Object.create(H5P.EventDispatcher.prototype);
  Wrapper.prototype.constructor = Wrapper;
  return Wrapper;
})();
