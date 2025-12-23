import React from 'react';
import Export from '@components/Export/Export.js';
import Reset from './Reset.js';

function Footer() {
  return (
    <section className={'h5p-sequence-footer'}>
      <Reset/>
      <Export/>
    </section>
  );
}

export default Footer;
