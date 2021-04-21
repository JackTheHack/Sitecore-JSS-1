# escape=`

ARG SXA_IMAGE
ARG PARENT_IMAGE

FROM ${SXA_IMAGE} as sxa
FROM ${PARENT_IMAGE}

# Add SXA module
COPY --from=sxa C:\module\solr\cores-sxa.json C:\data\cores-sxa.json

#RUN C:\Add-SolrCores.ps1 -SolrPath C:\solr -SolrSchemaPath C:\sxa_data\managed-schema -SolrCoreNames 'sitecore_sxa_master_index,sitecore_sxa_web_index'; `
# Remove-Item -Path C:\sxa_data -Recurse -Force;