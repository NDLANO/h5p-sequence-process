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
    H5P.EventDispatcher.call(this);

    const {
      language = 'en'
    } = extras;

    let container;
    this.params = params;
    this.behaviour = params.behaviour || {};
    this.resizeEvents = [];
    this.resetStack = [];
    this.collectExportValuesStack = [];
    this.wrapper = null;
    this.id = contentId;
    this.language = language;
    this.activityStartTime = new Date();

    this.translations = Object.assign({}, {
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
      const wrapper = document.createElement('div');
      wrapper.classList.add('h5p-process-sequence-wrapper');
      this.wrapper = wrapper;

      ReactDOM.render(
        <SequenceProcessContext.Provider value={this}>
          <Main />
        </SequenceProcessContext.Provider>,
        this.wrapper
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

    this.registerReset = callback => this.resetStack.push(callback);

    this.attach = $container => {
      if (!this.wrapper) {
        createElements();
      }

      // Append elements to DOM
      $container[0].appendChild(this.wrapper);
      $container[0].classList.add('h5p-sequence-process');
      container = $container;
    };

    this.getRect = () => {
      return this.wrapper.getBoundingClientRect();
    };

    this.reset = () => {
      this.resetStack.forEach(callback => callback());
    };

    this.resize = () => {
      if (!this.wrapper) {
        return;
      }
        const rect = this.getRect();
      breakPoints.forEach(item => {
        if (item.shouldAdd(rect.width)) {
          this.wrapper.classList.add(item.className);
        } else {
          this.wrapper.classList.remove(item.className);
        }
      });
    };

    this.getRect = this.getRect.bind(this);
    this.resize = this.resize.bind(this);
    this.on('resize', this.resize);
  }

  return Wrapper;
})();
