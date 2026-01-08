import React, { Fragment, useContext } from 'react';
import { SequenceProcessContext } from '@context/SequenceProcessContext.js';
import { escapeHTML, stripHTML } from '@services/utils.js';

const Export = () => {
  const context = useContext(SequenceProcessContext);
  const exportContainer = React.useRef(null);
  let exportDocument = null;
  let exportObject = null;

  const getExportObject = () => {
    const {
      params: {
        header,
        description
      },
      translations,
      collectExportValues,
    } = context;

    const {
      resources,
      summary,
      userInput
    } = collectExportValues();

    if (!Array.isArray(userInput.labels)) {
      userInput.labels = [];
    }

    const labelsStructured = userInput.labels.reduce((accumulated, current) => {
      accumulated[current.id] = current.label;
      return accumulated;
    }, {});

    return Object.assign({}, translations, {
      mainTitle: header,
      description: stripHTML(description),
      hasResources: Array.isArray(resources) && resources.length > 0,
      hasLabels: userInput.labels.length > 0,
      hasSummaryComment: summary && summary.length > 0,
      summaryComment: summary,
      allLabels: userInput.labels.map((label) => label.label),
      resources: resources,
      sortedStatementList: userInput.sequencedStatements
        .map((statement) => userInput.statements[statement])
        .map((statement) => {
          return {
            labels: statement.selectedLabels.map((label) => labelsStructured[label]),
            comment: statement.comment || '',
            title: statement.statement,
          };
        })
    });
  };

  const getExportPreview = () => {
    const documentExportTemplate =
      '<div class="export-preview">' +
      '<div class="page-header" role="heading" tabindex="-1">' +
      ' <div class="page-title h1">{{mainTitle}}</div>' +
      '</div>' +
      '<div class="page-description">{{description}}</div>' +
      '<table>' +
      '<tr><th>{{headerStatement}}</th><th>{{headerLabels}}</th><th>{{headerComment}}</th></tr>' +
      '{{#sortedStatementList}}<tr>' +
      '<td>{{title}}</td>' +
      '<td>{{#labels}}<li>{{.}}</li>{{/labels}}</td>' +
      '<td>{{comment}}</td>' +
      '</tr>{{/sortedStatementList}}' +
      '</table>' +
      '{{#hasSummaryComment}}' +
      '<div class="h2">{{labelSummaryComment}}</div>' +
      '<p>{{summaryComment}}</p>' +
      '{{/hasSummaryComment}}' +
      '{{#hasResources}}' +
      '<div class="h2">{{header}}</div>' +
      '<table>' +
      '<tr><th>{{headerTitle}}</th><th>{{headerIntro}}</th><th>{{headerUrl}}</th></tr>' +
      '{{#resources}}<tr><td>{{title}}</td><td>{{introduction}}</td><td>{{url}}</td></tr>{{/resources}}' +
      '</table>' +
      '{{/hasResources}}' +
      '<div class="h2">{{headerAvailableLabels}}</div>' +
      '{{^hasLabels}}<p>{{labelNoLabels}}</p>{{/hasLabels}}' +
      '{{#allLabels}}' +
      '<li>{{.}}</li>' +
      '{{/allLabels}}' +
      '</div>';

    return Mustache.render(documentExportTemplate, exportObject);
  };

  const handleExport = () => {
    exportObject = getExportObject();

    context.triggerXAPIScored(0, 0, 'completed');

    exportDocument = new H5P.ExportPage(
      escapeHTML(exportObject.mainTitle),
      getExportPreview(),
      H5PIntegration.reportingIsEnabled || false,
      escapeHTML(context.translate('submitText')),
      escapeHTML(context.translate('submitConfirmedText')),
      escapeHTML(context.translate('selectAll')),
      escapeHTML(context.translate('export')),
      'exportTemplate.docx',
      exportObject
    );
    exportDocument.getElement().prependTo(exportContainer.current);
    H5P.$window.on('resize', () => exportDocument.trigger('resize'));
  };

  return (
    <Fragment>
      <button
        className={'h5p-sequence-button h5p-sequence-button-export pull-right'}
        onClick={handleExport}
        type={'button'}
      >
        {context.translate('createDocument')}
      </button>
      <div className={'export-container'} ref={exportContainer} />
    </Fragment>
  );
};

export default Export;
