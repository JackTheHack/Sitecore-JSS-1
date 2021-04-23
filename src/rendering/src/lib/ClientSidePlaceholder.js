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
        console.log(`Fetch placeholder for ${config.sitecoreApiHost}`);
        return dataApi.fetchPlaceholderData(placeholderName, itemId, {
            layoutServiceConfig: { host: config.sitecoreApiHost },
            querystringParams: { sc_lang: itemLanguage, sc_apikey: config.sitecoreApiKey },
            fetcher: dataFetcher,
        });
    }

    componentDidMount() {
        const placeholderToFetch = this.shouldFetchPlaceholder();

        if (placeholderToFetch) {
            console.log(`[${this.props.name}] Fetching personalized content for ${placeholderToFetch} placeholder `);
            const placeholderName = this.props.name;
            const { route } = this.props.sitecoreContext;
            const { itemLanguage, itemId } = route;
            const renderingId = this.props.rendering.uid;
            
            this.fetchPlaceholder(placeholderToFetch, itemLanguage, itemId)
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
        var doRun = 
            this.isClientside() &&
            !this.isDisconnectedMode() && 
            !this.isPageEditing() && 
            this.props.sitecoreContext.personalization && 
            this.props.sitecoreContext.personalization.personalizedRenderings;

        if(!doRun)
        {
            return null;
        }

        var elementPlaceholderRenderings = this.props.rendering.placeholders[this.props.name];

        if(!elementPlaceholderRenderings)
        {
            return null;
        }

        var placeholderToUpdate = null;
        
        elementPlaceholderRenderings.forEach(s => {
            var personalizedRendering = 
                this.props.sitecoreContext.personalization.personalizedRenderings
                    .find(v => v.uid == s.uid);

            if(personalizedRendering)
            {
                placeholderToUpdate = personalizedRendering.placeholder;
            }
        })

        return placeholderToUpdate;
    }
}

export default withSitecoreContext()(ClientSidePlaceholder);