# Push this project to GitHub (Kimheang-code-IT/CRUD-Project)
# Run this AFTER creating the repo at: https://github.com/new?name=CRUD-Project
# (Leave "Add a README" UNCHECKED when creating the repo)

Set-Location $PSScriptRoot
git push -u origin main
if ($LASTEXITCODE -eq 0) {
  Write-Host "Done! Your code is at https://github.com/Kimheang-code-IT/CRUD-Project" -ForegroundColor Green
} else {
  Write-Host "Push failed. Create the repo first: https://github.com/new?name=CRUD-Project" -ForegroundColor Yellow
}
