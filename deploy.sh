#!/bin/bash
# GitHub Pagesへのデプロイスクリプト (Bash)
# 使い方: ./deploy.sh <filename>

# カラーコード
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

if [ $# -eq 0 ]; then
    echo -e "${RED}❌ エラー: ファイル名を指定してください${NC}"
    echo "使い方: ./deploy.sh <filename>"
    exit 1
fi

FILENAME=$1
HTML_FILE="${FILENAME}.html"

echo -e "${GREEN}🚀 GitHub Pagesへのデプロイを開始します...${NC}"
echo ""

# ファイルの存在確認
if [ ! -f "$HTML_FILE" ]; then
    echo -e "${RED}❌ エラー: $HTML_FILE が見つかりません${NC}"
    echo "ダウンロードしたHTMLファイルをこのディレクトリに配置してください。"
    exit 1
fi

echo -e "${CYAN}📁 ファイル確認: $HTML_FILE ✓${NC}"

# Gitリポジトリの確認
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Gitリポジトリが初期化されていません${NC}"
    echo "Gitリポジトリを初期化しますか? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        git init
        echo -e "${GREEN}✓ Gitリポジトリを初期化しました${NC}"
    else
        echo -e "${RED}デプロイを中止しました${NC}"
        exit 1
    fi
fi

# Git add
echo ""
echo -e "${CYAN}📦 ファイルをステージング...${NC}"
git add "$HTML_FILE"

# Git commit
COMMIT_MESSAGE="Add link card: $FILENAME"
echo -e "${CYAN}💾 コミット...${NC}"
git commit -m "$COMMIT_MESSAGE"

# Git push
echo ""
echo -e "${CYAN}🚀 GitHub Pagesにプッシュ...${NC}"
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ デプロイ完了！${NC}"
    echo ""
    echo "GitHub Pagesで公開されました。"
    echo "数分後に以下のURLでアクセスできます："
    echo ""
    
    # リモートURLからGitHub Pages URLを生成
    REMOTE_URL=$(git config --get remote.origin.url)
    if [[ $REMOTE_URL =~ github.com[:/](.+)/(.+?)(\.git)?$ ]]; then
        USERNAME="${BASH_REMATCH[1]}"
        REPO="${BASH_REMATCH[2]}"
        GITHUB_PAGES_URL="https://${USERNAME}.github.io/${REPO}/${HTML_FILE}"
        echo -e "${GREEN}${GITHUB_PAGES_URL}${NC}"
    fi
else
    echo ""
    echo -e "${RED}❌ デプロイに失敗しました${NC}"
    echo "エラーメッセージを確認してください。"
    exit 1
fi
