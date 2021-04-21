# escape=`

ARG PARENT_IMAGE
ARG HEADLESS_SERVICES_IMAGE
ARG SXA_IMAGE
ARG SITECORE_POWERSHELL_IMAGE

FROM ${HEADLESS_SERVICES_IMAGE} AS headless_services
FROM ${SITECORE_POWERSHELL_IMAGE} AS spe
FROM ${SXA_IMAGE} as sxa
FROM ${PARENT_IMAGE}

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

# Copy and init the JSS / Headless Services Module
COPY --from=headless_services C:\module\db C:\jss_data
RUN C:\DeployDatabases.ps1 -ResourcesDirectory C:\jss_data; `
    Remove-Item -Path C:\jss_data -Recurse -Force;

# Copy SPE module
COPY --from=spe C:\module\db C:\spe_data
RUN C:\DeployDatabases.ps1 -ResourcesDirectory C:\spe_data; `
  Remove-Item -Path C:\spe_data -Recurse -Force;

# Copy SXA module
COPY --from=sxa C:\module\db C:\sxa_data
RUN C:\DeployDatabases.ps1 -ResourcesDirectory C:\sxa_data; `
  Remove-Item -Path C:\sxa_data -Recurse -Force;