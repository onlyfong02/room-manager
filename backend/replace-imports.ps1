# Script to replace all relative imports with path aliases
$files = Get-ChildItem -Path "src\modules" -Recurse -Filter "*.ts"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace common imports
    $content = $content -replace "from '\.\./\.\./common/", "from '@common/"
    $content = $content -replace "from '\.\./\.\./\.\./common/", "from '@common/"
    
    # Replace config imports
    $content = $content -replace "from '\.\./\.\./config/", "from '@config/"
    
    # Replace module imports (auth, users, etc.)
    $content = $content -replace "from '\.\./auth/", "from '@modules/auth/"
    $content = $content -replace "from '\.\./users/", "from '@modules/users/"
    $content = $content -replace "from '\.\./buildings/", "from '@modules/buildings/"
    $content = $content -replace "from '\.\./rooms/", "from '@modules/rooms/"
    $content = $content -replace "from '\.\./tenants/", "from '@modules/tenants/"
    $content = $content -replace "from '\.\./contracts/", "from '@modules/contracts/"
    $content = $content -replace "from '\.\./invoices/", "from '@modules/invoices/"
    $content = $content -replace "from '\.\./payments/", "from '@modules/payments/"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Import paths replaced successfully!"
