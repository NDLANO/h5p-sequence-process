import {escape, decode} from 'he';

export function StatementDataObject(initValues) {
    this.id = null;
    this.comment = null;
    this.added = false;
    this.statement = null;
    this.isPlaceholder = false;
    this.isUserAdded = false;
    this.editMode = false;
    this.touched = false;
    this.selectedLabels = [];
    return Object.assign(this, initValues);
}

export function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

export function stripHTML(html) {
    return html ? decode(html) : html;
}

export function escapeHTML(html) {
    return html ? escape(html) : html;
}

export function sanitizeParams(params) {
    const filterResourceList = element => Object.keys(element).length !== 0 && element.constructor === Object;
    const handleObject = sourceObject => {
        if (sourceObject === undefined || sourceObject === null || !filterResourceList(sourceObject)) {
            return sourceObject;
        }
        return Object.keys(sourceObject).reduce((aggregated, current) => {
            aggregated[current] = stripHTML(sourceObject[current]);
            return aggregated;
        }, {});
    };

    let {
        accessibility,
        header,
        description,
        l10n,
        resourceReport,
        resources,
        statementsList,
        summaryHeader,
        summaryInstruction,
        labelsList,
    } = params;

    if (Array.isArray(statementsList)) {
        statementsList = statementsList.map(statement => stripHTML(statement));
    }

    if (Array.isArray(labelsList)) {
        labelsList = labelsList.map(statement => stripHTML(statement));
    }

    if (resources.params.resourceList && resources.params.resourceList.filter(filterResourceList).length > 0) {
        resources.params = {
            ...resources.params,
            l10n: handleObject(resources.params.l10n),
            resourceList: resources.params.resourceList.filter(filterResourceList).map(resource => {
                const {
                    title,
                    introduction,
                } = resource;
                return {
                    ...resource,
                    title: stripHTML(title),
                    introduction: stripHTML(introduction),
                };
            })
        }
    }

    return {
        ...params,
        statementsList,
        labelsList,
        resources,
        header: stripHTML(header),
        description: stripHTML(description),
        summaryHeader: stripHTML(summaryHeader),
        summaryInstruction: stripHTML(summaryInstruction),
        l10n: handleObject(l10n),
        resourceReport: handleObject(resourceReport),
        accessibility: handleObject(accessibility),
    }
}
