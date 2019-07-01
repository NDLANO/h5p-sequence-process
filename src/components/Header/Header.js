import React from 'react';
import { SequenceProcessContext } from 'context/SequenceProcessContext';
import classnames from 'classnames';

export default class Header extends React.Component {

    static contextType = SequenceProcessContext;

    resourceList = null;
    resourceContainer = null;

    constructor(props) {
        super(props);

        this.showResourceList = this.showResourceList.bind(this);
    }

    componentDidMount() {
        const {
            params,
            id,
            language = 'en'
        } = this.context;
        this.resourceList = new H5P.ResourceList(params.type.params, id, language);
        this.resourceList.attach(this.resourceContainer);
    }

    showResourceList() {
        this.resourceList.show();
    }

    render() {
        const {
            params
        } = this.context;

        return (
            <div className={"h5p-sequence-header"}>
                <button className={"h5p-sequence-resources-btn"} onClick={this.showResourceList}>
                    <span className={classnames(['fa', 'fa-info-circle'])} />
                    <span>Resources</span>
                </button>
                <h2>{params.header}</h2>
                <div className={classnames('h5p-sequence-description')}>{params.description}</div>
                <div ref={el => this.resourceContainer = el} />
            </div>
        );
    }

};
