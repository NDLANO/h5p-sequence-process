import React, { use, useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SequenceSurface from '@components/SequenceSurface/SequenceSurface.js';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';
import SolutionDisplay from '@components/SolutionDisplay/SolutionDisplay.js';
import Summary from '@components/Summary/Summary.js';
import Footer from '@components/Footer/Footer.js';
import parse from 'html-react-parser';
import './Main.css';

const Main = (props) => {

  const resourceContainer = useRef();

  const {
    registerReset,
    behaviour,
    params,
    trigger,
  } = useContext(SequenceProcessContext);

  const [solution, setSolution] = useState(null);
  const [hideSolutionButton, setHideSolutionButton] = useState(false);
  const [disableSurface, setDisableSurface] = useState(false);

  const {
    id,
    language = 'en',
    collectExportValues,
    header,
    description = '',
    resources: resourcesList,
    showSolution,
  } = props;

  // Check if solution is available
  const isNonEmptyString = (str) => typeof str === 'string' && str.trim().length > 0;
  const hasNoPlaceholderDiv = (str) => !str.includes('<div>&nbsp;</div>');

  const hasSolution = props.solution &&
    isNonEmptyString(props.solution.sample) && isNonEmptyString(props.solution.introduction) &&
    (hasNoPlaceholderDiv(props.solution.sample) || hasNoPlaceholderDiv(props.solution.introduction));

  useEffect(() => {
    document.querySelectorAll('.h5p-sequence-draggable-container').forEach((element) => {
      element.classList.toggle('disabled', disableSurface);
    });
  }, [disableSurface]);

  useEffect(() => {
    registerReset(() => {
      setSolution(null);
      setDisableSurface(false);
      setHideSolutionButton(false);

      trigger('resize');
    });
  }, [registerReset]);

  const handleShowSolution = () => {
    const solutionData = showSolution();
    if (solutionData) {
      setSolution(solutionData);
      setDisableSurface(true);
      setHideSolutionButton(true);

      trigger('resize');
    }
    else {
      console.warn('No solution available.');
    }
  };

  useEffect(() => {
    const filterResourceList = (element) => {
      return element?.constructor === Object && Object.keys(element).length > 0 && element.title;
    };
    if (resourcesList.params.resourceList && resourcesList.params.resourceList.filter(filterResourceList).length > 0) {
      const resourceList = new H5P.ResourceList(resourcesList.params, id, language);
      resourceList.attach(resourceContainer.current);

      collectExportValues('resources', () => resourcesList.params.resourceList
        .filter(filterResourceList)
        .map((resource) => Object.assign({}, {
          title: '',
          url: '',
          introduction: '',
        }, resource)) || []);
    }
  }, [resourcesList]);

  return (
    <article
      style={{ '--min-overlay-z-index': behaviour.useStackedView === true ? params.statementsList.length : undefined }}
    >
      <div className={'h5p-sequence-header'}>{header}</div>
      <div className={'h5p-sequence-surface-main'}>
        <div className={'h5p-sequence-surface-info'} ref={resourceContainer}>
          {description && (
            <div className={'h5p-sequence-description'}>{parse(description)}</div>
          )}
        </div>
        <SequenceSurface disabled={disableSurface}/>
        {behaviour.provideSummary === true && (
          <Summary
            reset={registerReset}
            exportValues={collectExportValues}
            summaryHeader={params.summaryHeader}
            summaryInstruction={params.summaryInstruction}
            disabled={disableSurface}
          />
        )}
      </div>
      {solution && <SolutionDisplay solution={solution} reset={registerReset} />}
      <Footer
        showSolution={handleShowSolution}
        hasSolution={hasSolution && !hideSolutionButton}
      />
    </article>
  );
};

Main.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  language: PropTypes.string,
  header: PropTypes.string,
  description: PropTypes.string,
  collectExportValues: PropTypes.func,
  resources: PropTypes.object,
  solution: PropTypes.object,
  showSolution: PropTypes.func,
};

export default Main;
