import React from 'react';

export const SequenceProcessContext = React.createContext({
    params: {},
    behaviour: {},
    id: null,
    language: 'en',
    translations: {},
    registerResizeEvent: () => {},
});
