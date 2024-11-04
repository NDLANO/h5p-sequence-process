/**
 * @typedef {Object} Label
 * @property {string} id - Unique identifier for the label
 * @property {string} label - Display text for the label
 */

/**
 * @typedef {Object} Statement
 * @property {boolean} touched - Whether the statement has been interacted with
 * @property {string[]} selectedLabels - Array of label IDs that apply to this statement
 * @property {string} comment - User's comment on the statement
 * @property {string} statement - The actual statement text
 */

/**
 * @typedef {Object} UserInput
 * @property {Label[]} labels - Array of available labels
 * @property {string[]} sequencedStatements - Array of statement IDs in sequence
 * @property {Object.<string, Statement>} statements - Object mapping statement IDs to Statement objects
 */

// Example structure that can be used as a template
export const createEmptyUserInput = () => ({
    labels: [],
    sequencedStatements: [],
    statements: {}
  });
  
  // Example with data
  export const exampleUserInput = {
    labels: [
      { id: '1', label: 'Important' },
      { id: '2', label: 'Follow-up' }
    ],
    sequencedStatements: ['stmt1', 'stmt2'],
    statements: {
      'stmt1': {
        touched: true,
        selectedLabels: ['1'],
        comment: 'First comment',
        statement: 'First statement'
      },
      'stmt2': {
        touched: true,
        selectedLabels: ['1', '2'],
        comment: 'Second comment',
        statement: 'Second statement'
      }
    }
  }; 