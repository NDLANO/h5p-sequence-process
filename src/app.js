import "@babel/polyfill";
import React from 'react';
import ReactDOM from "react-dom";
import Main from "components/Main";
import {SequenceProcessContext} from 'context/SequenceProcessContext';
import * as languages from 'language';

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

  const supportedLanguages = {en: languages.languageEn, nb: languages.languageNb, nn: languages.languageNn};

  function Wrapper(params, contentId, extras = {}) {
    // Initialize event inheritance
    H5P.EventDispatcher.call(self);

    let wrapper;
    let container;
    this.params = params;
    this.behaviour = params.behaviour || {};
    this.resizeEvents = [];

    const {
      language = 'en'
    } = extras;

    this.l10n = Object.assign({}, languages.languageEn, supportedLanguages[language]);

    const createElements = () => {
      wrapper = document.createElement('div');
      wrapper.classList.add('h5p-process-sequence-wrapper');

      const contextParams = {
        params: this.params,
        behaviour: this.behaviour,
        id: contentId,
        translations: this.l10n,
        language: language,
        registerResizeEvent: this.registerResizeEvent
      };

      ReactDOM.render(
        <SequenceProcessContext.Provider value={contextParams}>
          <Main />
        </SequenceProcessContext.Provider>,
        wrapper
      );
    };

    this.registerResizeEvent = callback => this.resizeEvents.push(callback);

    this.attach = $container => {
      if (!wrapper) {
        createElements();
      }

      // Append elements to DOM
      $container[0].appendChild(wrapper);
      $container[0].classList.add('h5p-sequence-process');
      container = $container;
    };

    this.getRect = () => {
      return wrapper.getBoundingClientRect();
    };

    this.on('resize', () => {
      const rect = this.getRect();
      breakPoints.forEach(item => {
        if (item.shouldAdd(rect.width)) {
          wrapper.classList.add(item.className);
        } else {
          wrapper.classList.remove(item.className);
        }
      });
      this.resizeEvents.forEach(callback => callback(rect));
    });
  }

  return Wrapper;
})();
