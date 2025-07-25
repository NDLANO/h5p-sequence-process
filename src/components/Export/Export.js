import React, { Component, Fragment } from 'react';
import { SequenceProcessContext } from '../../context/SequenceProcessContext';
import { escapeHTML, stripHTML } from '../utils';

export default class Export extends Component {
  static contextType = SequenceProcessContext;

  exportDocument = null;
  exportContainer = null;

  exportObject = null;

  constructor(props) {
    super(props);

    this.handleExport = this.handleExport.bind(this);
  }

  getExportObject() {
    const {
      params: {
        header,
        description
      },
      translations,
      collectExportValues,
    } = this.context;

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
  }

  getExportPreview() {
    const documentExportTemplate =
      '<div class="export-preview">' +
      '<div class="page-header" role="heading" tabindex="-1">' +
      ' <div class="page-title h1">{{mainTitle}}</div>' +
      '</div>' +
      '<div class="page-description">{{description}}</div>' +
      '<table>' +
      '<tr><th>{{headerStatement}}</th><th>{{headerLabels}}</th><th>{{headerComment}}</th></tr>' +
      '{{#sortedStatementList}}<tr><td>{{title}}</td><td>{{#labels}}<li>{{.}}</li>{{/labels}}</td><td>{{comment}}</td></tr>{{/sortedStatementList}}' +
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

    return Mustache.render(documentExportTemplate, this.exportObject);
  }

  handleExport() {
    this.exportObject = this.getExportObject();

    this.context.triggerXAPIScored(0, 0, 'completed');

    this.exportDocument = new H5P.ExportPage(
      escapeHTML(this.exportObject.mainTitle),
      this.getExportPreview(),
      H5PIntegration.reportingIsEnabled || false,
      escapeHTML(this.context.translate('submitText')),
      escapeHTML(this.context.translate('submitConfirmedText')),
      escapeHTML(this.context.translate('selectAll')),
      escapeHTML(this.context.translate('export')),
      H5P.instances[0].getLibraryFilePath('exportTemplate.docx'),
      this.exportObject
    );
    this.exportDocument.getElement().prependTo(this.exportContainer);
    H5P.$window.on('resize', () => this.exportDocument.trigger('resize'));
  }

  render() {
    return (
      <Fragment>
        <button
          className={'h5p-sequence-button-export pull-right'}
          onClick={this.handleExport}
          type={'button'}
        >
          <span className={'h5p-ri hri-document'} />
          {this.context.translate('createDocument')}
        </button>
        <div className={'export-container'} ref={(el) => this.exportContainer = el} />
      </Fragment>
    );
  }
}
