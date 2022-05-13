<#
.SYNOPSIS
    Copy all modified and newly created files from the working tree to the destination directory.

.PARAMETER Destination
    Directory to which the files should be copied to.
#>

param (
    [Parameter(Mandatory)][string]$Destination
)

$Unstaged = git ls-files --others --exclude-standard
$Modified = git ls-files --modified

$Files = $($Unstaged + $Modified) -split "\n"
foreach ($File in $Files) {
    $FinalDestination = $($Destination + "\" + $File)

    [void](New-Item -Force $FinalDestination)
    Copy-Item $File -Destination $FinalDestination -PassThru
}