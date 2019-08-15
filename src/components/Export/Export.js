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

    handleExport() {
        const {
            registerResizeEvent
        } = this.context;

        this.exportDocument = new H5P.ExportPage("Tittel her",
            "Her kommer en forhåndsvisning av eksporten",
            false,
            "",
            "",
            "Velg alt",
            "Exporter",
            H5P.instances[0].getLibraryFilePath('exportTemplate.docx'),
            {
                mainTitle: "[Tittelen på oppgaven]",
                summaryComment: "Min kommentar om alt",
                noLabel: "Ingen etiketter",
                labelSummaryComment: "Kommentar oppsummering",
                labelComment: "Kommentar",
                labelHeader: "Etiketter",
                labelStatement: "Påstand",
                sortedStatementList: [
                    {
                        title: "Kongen av haugen",
                        labels: ["Test", "Test 2"],
                        comment: "Statement comment"
                    },
                    {
                        title: "Andreplass er første taper",
                        labels: [],
                        comment: ""
                    },
                    {
                        title: "Tredje mann i bakken",
                        labels: [],
                        comment: "Unna vei"
                    },
                    {
                        title: "Fire i sekken",
                        labels: ["Tungt"],
                        comment: ""
                    }
                ],
            }
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