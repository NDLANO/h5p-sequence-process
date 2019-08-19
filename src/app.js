import "core-js";
import "regenerator-runtime/runtime";
import React from 'react';
import ReactDOM from "react-dom";
import Main from "components/Main";
import {SequenceProcessContext} from 'context/SequenceProcessContext';

// Load library
H5P = H5P || {};
H5P.SequenceProcess = (function () {

  const breakPoints = [
    {
      "className": "h5p-medium-tablet-size",
      "shouldAdd": width => width >= 480 && width < 768
    },
    {
      "className": "h5p-large-tablet-size",
      "shouldAdd": width => width >= 768 && width < 1024
    },
    {
      "className": "h5p-large-size",
      "shouldAdd": width => width >= 1024
    },
  ];

  function Wrapper(params, contentId, extras = {}) {
    // Initialize event inheritance
    H5P.EventDispatcher.call(self);

    let wrapper;
    let container;
    this.params = params;
    this.behaviour = params.behaviour || {};
    this.resizeEvents = [];
    this.resetStack = [];
    this.collectExportValuesStack = [];

    const {
      language = 'en'
    } = extras;

    this.l10n = Object.assign({}, {
      summary: "Summary",
      typeYourReasonsForSuchAnswers: "Type your reasons for such answers",
      resources: "Resources",
      save: "Save",
      electAllLabelsConnectedToThisItem: "Select all labels connected to this item",
      restart: "Restart",
      createDocument: "Create document",
      labelSummaryComment: "Summary comment",
      labelComment: "Comment",
      noLabels: "Ingen etiketter",
      labelLabels: "Labels",
      labelAvailableLabels: "Available labels",
      labelStatement: "Statement",
      labelNoComment: "No comment",
      labelResources: "Resources",
      labelNoLabels: "No labels",
      selectAll: "Select all",
      export: "Export",
    }, params.l10n, params.resourceReport);

    const createElements = () => {
      wrapper = document.createElement('div');
      wrapper.classList.add('h5p-process-sequence-wrapper');

      const contextParams = {
        params: this.params,
        behaviour: this.behaviour,
        id: contentId,
        translations: this.l10n,
        language: language,
        registerResizeEvent: this.registerResizeEvent,
        registerReset: this.registerReset,
        reset: this.onReset,
        collectExportValues: this.collectExportValues,
      };

      ReactDOM.render(
        <SequenceProcessContext.Provider value={contextParams}>
          <Main />
        </SequenceProcessContext.Provider>,
        wrapper
      );
    };

    this.collectExportValues = (index, callback) => {
      if( typeof index !== "undefined"){
        this.collectExportValuesStack.push({key: index, callback: callback});
      } else {
        const exportValues = {};
        this.collectExportValuesStack.forEach(({key, callback}) => exportValues[key] = callback());
        return exportValues;
      }
    };

    this.registerResizeEvent = callback => this.resizeEvents.push(callback);
    this.registerReset = callback => this.resetStack.push(callback);

    this.attach = $container => {
      if (!wrapper) {
        createElements();
      }

      this.registerResizeEvent(this.onResize);

      // Append elements to DOM
      $container[0].appendChild(wrapper);
      $container[0].classList.add('h5p-sequence-process');
      container = $container;
    };

    this.getRect = () => {
      return wrapper.getBoundingClientRect();
    };

    this.onReset = () => {
      this.resetStack.forEach(callback => callback());
    };

    this.onResize = rect => {
      breakPoints.forEach(item => {
        if (item.shouldAdd(rect.width)) {
          wrapper.classList.add(item.className);
        } else {
          wrapper.classList.remove(item.className);
        }
      });
    };

    this.on('resize', () => {
      const rect = this.getRect();
      this.resizeEvents.forEach(callback => callback(rect));
    });
  }

  return Wrapper;
})();
