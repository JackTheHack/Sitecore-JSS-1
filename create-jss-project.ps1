$ErrorActionPreference = "Stop"

##
## This script is used to add / initialize a JSS project using 'jss create'
## when this template is instantiated. It can be safely deleted.
##

Function Add-JssProject {
    Write-Host "Adding JSS sample to solution via 'jss create'..."

    if ($null -eq (Get-Command "npm" -ErrorAction SilentlyContinue)) 
    { 
       Write-Host "You must install node.js, see https://nodejs.org/" -ForegroundColor Red
       Exit 1
    }
    
    if ($null -eq (Get-Command "jss" -ErrorAction SilentlyContinue)) 
    { 
       Write-Host "Installing Sitecore JSS CLI" -ForegroundColor Green
       npm install -g @sitecore-jss/sitecore-jss-cli
    }
    
    Push-Location src
    try {
        $projectName = "jss-1"
        Write-Host "Creating JSS Project for $projectName" -ForegroundColor Green
    
        # JSS project name transformed by our dotnet new template symbols
        $jssProjectName = "jss"
        if ($jssProjectName -ne $projectName) {
            Write-Host "Transformed to valid JSS project name $jssProjectName" -ForegroundColor Yellow
        }
    
        # Suppress 'jss create' output to avoid confusion from default instructions
        jss create $jssProjectName nextjs --branch release/16.0.0 | Out-Null
        Move-Item -Force $jssProjectName rendering | Out-Null
        Push-Location rendering
        try {
            jss setup `
                --instancePath "..\..\docker\deploy\platform\" `
                --layoutServiceHost "https://www.jss_1.localhost" `
                --apiKey "5c580c89-280f-4d37-a593-f27f7350fdef" `
                --deployUrl "https://cm.jss_1.localhost/sitecore/api/jss/import" `
                --deploySecret "529227501d644c2986f11adb54bc428b" `
                --nonInteractive `
                --skipValidation | Out-Null
            Update-JssProjectFiles
        } finally {
            Pop-Location
        }
    } finally {
        Pop-Location
    }
    Write-Host "Done!"
}

Function Update-JssProjectFiles {
    Write-Host "Updating JSS sample for containerized environment" -ForegroundColor Green

    # Update .gitignore
    # Values will be consistent across developers and deployment secret is an env var
    $gitignore = ".\.gitignore"
    Set-Content -Path $gitignore -Value (
        Get-Content $gitignore |
        Select-String -NotMatch "# sitecore|scjssconfig.json|\*.deploysecret.config"
    )

    ## Remove config patches since the dotnet new template provides them
    Remove-Item -Recurse -Force .\sitecore\config
}

Add-JssProject