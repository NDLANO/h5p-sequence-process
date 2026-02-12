import { escape, decode } from 'he';

/** @constant {number} HEX Hexadecimal radix. */
const HEX = 16;

/** @constant {number} LUMINANCE_FACTOR_RED Red channel luminance factor for contrast calculation. */
const LUMINANCE_FACTOR_RED = 0.299;

/** @constant {number} LUMINANCE_FACTOR_GREEN Green channel luminance factor for contrast calculation. */
const LUMINANCE_FACTOR_GREEN = 0.587;

/** @constant {number} LUMINANCE_FACTOR_BLUE Blue channel luminance factor for contrast calculation. */
const LUMINANCE_FACTOR_BLUE = 0.114;

/** @constant {number} LUMINANCE_THRESHOLD Threshold for luminance to decide light/dark color. */
const LUMINANCE_THRESHOLD = 0.5;

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
 * Sanitize dropzones list
 * @param {object[]} dropzonesList List of dropzones to sanitize.
 * @returns {object[]} Sanitized dropzones list.
 */
const sanitizeDropzonesList = (dropzonesList) => {
  if (!Array.isArray(dropzonesList)) {
    return [];
  }

  return dropzonesList
    .filter((dropzone) => typeof dropzone === 'object' && dropzone !== null)
    .map((dropzone) => {
      if (typeof dropzone.enumeration !== 'object' || dropzone.enumeration === null) {
        dropzone.enumeration = {};
      }

      return dropzone;
    });
};

/**
 * Adjust dropzone parameters to ensure consistent behavior and appearance.
 * @param {object[]} dropzonesList List of dropzones to adjust.
 * @returns {object[]} Adjusted dropzones list.
 */
const adjustDropzoneParameters = (dropzonesList) => {
  const hasEnumeration = dropzonesList.some((dropzone) => dropzone?.showEnumeration === true);

  const clonedList = [...dropzonesList].map((dropzone) => {
    if (hasEnumeration) {
      dropzone.showEnumeration = true;
    }

    dropzone.enumeration = dropzone.enumeration || {};

    if (Object.keys(dropzone.enumeration).length === 0) {
      dropzone.hidden = true;
    }

    if (typeof dropzone.enumeration.backgroundColor === 'undefined') {
      dropzone.enumeration.backgroundColor = dropzone.backgroundColor;
    }

    return dropzone;
  });

  return clonedList;
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
    dropzonesList,
  } = params;

  const sanitizedStatementsList = decodeArray(statementsList) ?? [];

  let sanitizedDropzonesList = sanitizeDropzonesList(dropzonesList);
  const statementsCount = sanitizedStatementsList?.length ?? 0;
  while (sanitizedDropzonesList?.length < statementsCount) {
    sanitizedDropzonesList.push({ showEnumeration: false });
  }
  sanitizedDropzonesList = sanitizedDropzonesList.slice(0, statementsCount);
  sanitizedDropzonesList = adjustDropzoneParameters(sanitizedDropzonesList);

  const sanitized = {
    ...params,
    statementsList: sanitizedStatementsList,
    labelsList: decodeArray(labelsList) ?? [],
    dropzonesList: sanitizedDropzonesList,
    resources: sanitizeResourcesParams(resources),
    header: decodeHTML(header),
    description: decodeHTML(description),
    summaryHeader: decodeHTML(summaryHeader),
    summaryInstruction: decodeHTML(summaryInstruction),
    l10n: decodeObjectValues(l10n),
    resourceReport: decodeObjectValues(resourceReport),
    accessibility: decodeObjectValues(accessibility),
  };

  return sanitized;
};

export const debounce = (func, wait, immediate) => {
  let timeout;

  return function (...args) {
    const context = this;

    const later = () => {
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

/**
 * Convert RGB color to relative luminance.
 * @param {number} r Red channel (0-255).
 * @param {number} g Green channel (0-255).
 * @param {number} b Blue channel (0-255).
 * @returns {number} Relative luminance (0-1).
 */
const getRelativeLuminance = (r, g, b) => {
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const sRGB = channel / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return LUMINANCE_FACTOR_RED * rs + LUMINANCE_FACTOR_GREEN * gs + LUMINANCE_FACTOR_BLUE * bs;
};

/**
 * Compute contrast ratio between two colors.
 * @param {string} color1 First color in 6 char hex: #rrggbb.
 * @param {string} color2 Second color in 6 char hex: #rrggbb.
 * @returns {number|null} Contrast ratio (1-21) or null if invalid input.
 */
export const computeContrastRatio = (color1, color2) => {
  if (
    typeof color1 !== 'string' || !/#[0-9a-f]{6}/i.test(color1) ||
    typeof color2 !== 'string' || !/#[0-9a-f]{6}/i.test(color2)
  ) {
    return null;
  }

  const rgb1 = [
    parseInt(color1.substring(1, 3), HEX),
    parseInt(color1.substring(3, 5), HEX),
    parseInt(color1.substring(5, 7), HEX),
  ];

  const rgb2 = [
    parseInt(color2.substring(1, 3), HEX),
    parseInt(color2.substring(3, 5), HEX),
    parseInt(color2.substring(5, 7), HEX),
  ];

  const l1 = getRelativeLuminance(...rgb1);
  const l2 = getRelativeLuminance(...rgb2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Compute focus color to given color.
 * @param {string} colorCode Color code in 6 char hex: #rrggbb.
 * @returns {string} RGB focus color code in 6 char hex: #rrggbb.
 */
export const computeFocusColor = (colorCode) => {
  if (typeof colorCode !== 'string' || !/#[0-9a-fA-F]{6}/.test(colorCode)) {
    return null;
  }

  const contrastToWhite = computeContrastRatio(colorCode, '#ffffff');
  const contrastToBlack = computeContrastRatio(colorCode, '#000000');

  if (contrastToWhite > contrastToBlack) {
    return '#ffffff';
  }
  else {
    return '#000000';
  }
};
