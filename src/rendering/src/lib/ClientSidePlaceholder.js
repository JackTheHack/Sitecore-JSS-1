import React from 'react';
import { withSitecoreContext, dataApi, Placeholder, LayoutServiceData } from '@sitecore-jss/sitecore-jss-react';
import { LayoutService } from '@sitecore-jss/sitecore-jss';
import { dataFetcher } from 'lib/data-fetcher';
import config from 'temp/config';

class ClientSidePlaceholder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            elements: null
        };
    }

    fetchPlaceholder(placeholderName, itemLanguage, itemId) {
        return dataApi.fetchPlaceholderData(placeholderName, itemId, {
            layoutServiceConfig: { host: config.sitecoreApiHost },
            querystringParams: { sc_lang: itemLanguage, sc_apikey: config.sitecoreApiKey },
            fetcher: dataFetcher,
        });
    }

    componentDidMount() {
        const shouldFetch = this.shouldFetchPlaceholder();

        if (shouldFetch) {
            const placeholderName = this.props.name;
            const { route } = this.props.sitecoreContext;
            const { itemLanguage, itemId } = route;

            this.fetchPlaceholder(placeholderName, itemLanguage, itemId)
                .then(result => {
                    this.setState({
                        elements: result.elements
                    });
                })
        }
    }

    render() {
        const rendering = {
            ...this.props.rendering
        };

        rendering.placeholders[this.props.name] = this.state.elements ? this.state.elements : 
            this.props.hideInitialContents ? [] : rendering.placeholders[this.props.name];

        const placeholderProps = {
            ...this.props,
            rendering
        }

        return <Placeholder {...placeholderProps} />
    }

    isClientside() {
        return typeof window !== 'undefined';
    }

    isDisconnectedMode() {
        const disconnectedMode = this.props.sitecoreContext.site.name === 'JssDisconnectedLayoutService';
        return disconnectedMode;
    }

    isPageEditing() {
        const isEditing = this.props.sitecoreContext.pageEditing;
        return isEditing;
    }

    shouldFetchPlaceholder() {
        return this.isClientside() && !this.isDisconnectedMode() && !this.isPageEditing();
    }
}

export default withSitecoreContext()(ClientSidePlaceholder);