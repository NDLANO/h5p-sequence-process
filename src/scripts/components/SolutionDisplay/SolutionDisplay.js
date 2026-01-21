import React, { use, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'html-react-parser';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';
import './SolutionDisplay.css';

/**
 * Solution Display component.
 * @param {object} props Component props.
 * @param {object} props.solution Solution object.
 * @returns {object} JSX element.
 */
const SolutionDisplay = ({ solution }) => {
  const sequenceProcessContext = useContext(SequenceProcessContext);
  const { translate } = sequenceProcessContext;

  return (
    <div className="h5p-sequence-solution-container">
      <div className="h5p-sequence-solution-header">
        {translate('headerSolution') || 'Sample solution'}
      </div>
      {solution.explanation && (
        <div className="h5p-sequence-solution-introduction">
          {ReactHtmlParser(solution.explanation)}
        </div>
      )}
      <div className="h5p-sequence-solution-sample">
        <div className="h5p-sequence-solution-sample-text">
          {ReactHtmlParser(solution.sample)}
        </div>
      </div>
    </div>
  );
};

SolutionDisplay.propTypes = {
  solution: PropTypes.shape({
    explanation: PropTypes.string,
    sample: PropTypes.string.isRequired,
  }).isRequired,
};

export default SolutionDisplay;
