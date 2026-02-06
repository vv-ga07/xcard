# GitHub Pagesへのデプロイスクリプト (PowerShell)
# 使い方: .\deploy.ps1 <filename>

param(
    [Parameter(Mandatory=$true)]
    [string]$FileName
)

# カラー出力用関数
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Green "🚀 GitHub Pagesへのデプロイを開始します..."
Write-Host ""

# ファイルの存在確認
$htmlFile = "$FileName.html"
if (-Not (Test-Path $htmlFile)) {
    Write-ColorOutput Red "❌ エラー: $htmlFile が見つかりません"
    Write-Host "ダウンロードしたHTMLファイルをこのディレクトリに配置してください。"
    exit 1
}

Write-ColorOutput Cyan "📁 ファイル確認: $htmlFile ✓"

# Gitリポジトリの確認
if (-Not (Test-Path ".git")) {
    Write-ColorOutput Yellow "⚠️  Gitリポジトリが初期化されていません"
    Write-Host "Gitリポジトリを初期化しますか? (Y/N)"
    $response = Read-Host
    if ($response -eq "Y" -or $response -eq "y") {
        git init
        Write-ColorOutput Green "✓ Gitリポジトリを初期化しました"
    } else {
        Write-ColorOutput Red "デプロイを中止しました"
        exit 1
    }
}

# Git add
Write-Host ""
Write-ColorOutput Cyan "📦 ファイルをステージング..."
git add $htmlFile

# Git commit
$commitMessage = "Add link card: $FileName"
Write-ColorOutput Cyan "💾 コミット..."
git commit -m $commitMessage

# Git push
Write-Host ""
Write-ColorOutput Cyan "🚀 GitHub Pagesにプッシュ..."
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-ColorOutput Green "✅ デプロイ完了！"
    Write-Host ""
    Write-Host "GitHub Pagesで公開されました。"
    Write-Host "数分後に以下のURLでアクセスできます："
    Write-Host ""
    
    # リモートURLからGitHub Pages URLを生成
    $remoteUrl = git config --get remote.origin.url
    if ($remoteUrl -match "github.com[:/](.+)/(.+?)(\.git)?$") {
        $username = $matches[1]
        $repo = $matches[2]
        $githubPagesUrl = "https://$username.github.io/$repo/$htmlFile"
        Write-ColorOutput Green $githubPagesUrl
    }
} else {
    Write-Host ""
    Write-ColorOutput Red "❌ デプロイに失敗しました"
    Write-Host "エラーメッセージを確認してください。"
    exit 1
}
