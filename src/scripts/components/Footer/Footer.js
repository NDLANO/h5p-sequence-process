import React from 'react';
import PropTypes from 'prop-types';
import Export from '@components/Export/Export.js';
import Reset from './Reset.js';
import ShowSolution from './ShowSolution.js';

import './Footer.css';

const Footer = ({ showSolution, hasSolution }) => {
  return (
    <section className={'h5p-sequence-footer'}>
      {hasSolution && <ShowSolution showSolution={showSolution} />}
      <Reset/>
      <Export/>
    </section>
  );
};

Footer.propTypes = {
  showSolution: PropTypes.func.isRequired,
  hasSolution: PropTypes.bool.isRequired,
};

export default Footer;
