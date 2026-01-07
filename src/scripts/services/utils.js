import { escape, decode } from 'he';

export const decodeHTML = (html) => {
  return html ? decode(html) : html;
};

export const escapeHTML = (html) => {
  return html ? escape(html) : html;
};

export const stripHTML = (html) => {
  const element = document.createElement('div');
  element.innerHTML = html;
  return element.innerText;
};

/**
 * Determine whether an element is a plain object.
 * @param {object} element Element to check.
 * @returns {boolean} True if the element is a plain object, false otherwise.
 */
const isPlainObject = (element) => element?.constructor === Object && Object.keys(element)?.length !== 0;

/**
 * Decode all strings in an array.
 * @param {string[]} list Array of strings to decode.
 * @returns {string[]} Decoded array of strings.
 */
const decodeArray = (list) => (Array.isArray(list) ? list.map(decodeHTML) : list);

/**
 * Decode all values in an object.
 * @param {object} source Object to decode.
 * @returns {object} Decoded object.
 */
const decodeObjectValues = (source) => {
  if (!isPlainObject(source)) {
    return source;
  }

  return Object.keys(source).reduce((acc, key) => {
    acc[key] = decodeHTML(source[key]);
    return acc;
  }, {});
};

/**
 * Sanitize a single resource item.
 * @param {object} resource Resource item.
 * @returns {object} Sanitized resource item.
 */
const sanitizeResourceItem = (resource) => ({
  ...resource,
  title: decodeHTML(resource.title),
  introduction: decodeHTML(resource.introduction),
});

/**
 * Sanitize resources parameters.
 * @param {object} resources Resources parameters.
 * @returns {object} Sanitized resources parameters.
 */
const sanitizeResourcesParams = (resources) => {
  const resourceList = resources?.params?.resourceList;
  if (!Array.isArray(resourceList) || !resourceList.some(isPlainObject)) {
    return resources;
  }

  const filtered = resourceList
    .filter(isPlainObject)
    .filter((item) => item.title !== undefined)
    .map(sanitizeResourceItem);

  return {
    ...resources,
    params: {
      ...resources.params,
      l10n: decodeObjectValues(resources.params.l10n),
      resourceList: filtered,
    },
  };
};

/**
 * Sanitize parameters.
 * @param {object} params Parameters to sanitize.
 * @returns {object} Sanitized parameters.
 */
export const sanitizeParams = (params) => {
  const {
    accessibility,
    header,
    description,
    l10n,
    resourceReport,
    resources,
    statementsList,
    summaryHeader,
    summaryInstruction,
    labelsList,
  } = params;

  return {
    ...params,
    statementsList: decodeArray(statementsList),
    labelsList: decodeArray(labelsList),
    resources: sanitizeResourcesParams(resources),
    header: decodeHTML(header),
    description: decodeHTML(description),
    summaryHeader: decodeHTML(summaryHeader),
    summaryInstruction: decodeHTML(summaryInstruction),
    l10n: decodeObjectValues(l10n),
    resourceReport: decodeObjectValues(resourceReport),
    accessibility: decodeObjectValues(accessibility),
  };
};

export const debounce = (func, wait, immediate) => {
  let timeout;

  return function (...args) {
    const context = this;

    const later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    };
  };
};
