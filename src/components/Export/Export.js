import React, {Component, Fragment} from 'react';
import {SequenceProcessContext} from "../../context/SequenceProcessContext";

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

        const labelsStructured = userInput.labels.reduce((accumulated, current) => {
            accumulated[current.id] = current.label;
            return accumulated;
        }, {});

        return Object.assign({}, translations, {
            mainTitle: header,
            description,
            hasResources: resources.length > 0,
            hasLabels: userInput.labels.length > 0,
            hasSummaryComment: summary && summary.length > 0,
            summaryComment: summary,
            allLabels: userInput.labels.map(label => label.label),
            resources: resources,
            sortedStatementList: userInput.sequencedStatements
                .map(statement => userInput.statements[statement])
                .map(statement => {
                    return {
                        labels: statement.selectedLabels.map(label => labelsStructured[label]),
                        comment: statement.comment || "",
                        title: statement.statement,
                    }
                })
        });
    }

    getExportPreview() {
        const documentExportTemplate =
            '<div class="export-preview">' +
            '<div class="page-header" role="heading" tabindex="-1">' +
            ' <h1 class="page-title">{{mainTitle}}</h1>' +
            '</div>' +
            '<div class="page-description">{{description}}</div>' +
            '<table>' +
            '<tr><th>{{headerStatement}}</th><th>{{headerLabels}}</th><th>{{headerComment}}</th></tr>' +
            '{{#sortedStatementList}}<tr><td>{{title}}</td><td>{{#labels}}<li>{{.}}</li>{{/labels}}</td><td>{{comment}}</td></tr>{{/sortedStatementList}}' +
            '</table>' +
            '<h2>{{labelSummaryComment}}</h2>' +
            '<p>{{^hasSummaryComment}}{{labelNoSummaryComment}}{{/hasSummaryComment}}{{summaryComment}}</p>' +
            '<h2>{{header}}</h2>' +
            '{{^resources}}<p>{{labelNoResources}}</p>{{/resources}}' +
            '{{#hasResources}}' +
            '<table>' +
            '<tr><th>{{headerTitle}}</th><th>{{headerIntro}}</th><th>{{headerUrl}}</th></tr>' +
            '{{#resources}}<tr><td>{{title}}</td><td>{{introduction}}</td><td>{{url}}</td></tr>{{/resources}}' +
            '</table>' +
            '{{/hasResources}}' +
            '<h2>{{headerAvailableLabels}}</h2>' +
            '{{^hasLabels}}<p>{{labelNoLabels}}</p>{{/hasLabels}}' +
            '{{#allLabels}}' +
            '<li>{{.}}</li>' +
            '{{/allLabels}}' +
            '</div>';

        return Mustache.render(documentExportTemplate, this.exportObject);
    }

    handleExport() {
        const {
            translations,
        } = this.context;

        this.exportObject = this.getExportObject();

        this.context.triggerXAPIScored(0, 0, 'completed');

        this.exportDocument = new H5P.ExportPage(
            this.exportObject.mainTitle,
            this.getExportPreview(),
            true,
            translations.submitText,
            translations.submitConfirmedText,
            translations.selectAll,
            translations.export,
            H5P.instances[0].getLibraryFilePath('exportTemplate.docx'),
            this.exportObject
        );
        this.exportDocument.getElement().prependTo(this.exportContainer);
        H5P.$window.on('resize', () => this.exportDocument.trigger('resize'));
    }

    render() {
        const {
            translations
        } = this.context;

        return (
            <Fragment>
                <button
                    className={"h5p-sequence-button-export pull-right"}
                    onClick={this.handleExport}
                >
                    <i className={"fa fa-download"}/>
                    {translations.createDocument}
                </button>
                <div className={"export-container"} ref={el => this.exportContainer = el}/>
            </Fragment>
        )
    }
}