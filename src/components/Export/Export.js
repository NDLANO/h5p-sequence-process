import React, {Component, Fragment} from 'react';
import {SequenceProcessContext} from "../../context/SequenceProcessContext";

export default class Export extends Component {
    static contextType = SequenceProcessContext;

    exportDocument = null;
    exportContainer = null;

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

        // labelNoLabels: translations.labelNoLabels,
        //     labelSummaryComment: "Kommentar oppsummering",
        //     labelComment: "Kommentar",
        //     labelLabels: "Etiketter",
        //     labelAvailableLabel: "Tilgjengelige etiketter",
        //     labelStatement: "Påstand",

        return Object.assign({}, translations, {
            mainTitle: header,
            description,
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

    handleExport() {
        const {
            registerResizeEvent,
            translations,
        } = this.context;

        const exportObject = this.getExportObject();

        this.exportDocument = new H5P.ExportPage(
            exportObject.mainTitle,
            "Her kommer en forhåndsvisning av eksporten",
            false,
            "",
            "",
            translations.selectAll,
            translations.export,
            H5P.instances[0].getLibraryFilePath('exportTemplate.docx'),
            exportObject
        );
        this.exportDocument.getElement().prependTo(this.exportContainer);
        registerResizeEvent(() => this.exportDocument.trigger('resize'));
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
                <div className={"test"} ref={el => this.exportContainer = el}/>
            </Fragment>
        )
    }
}