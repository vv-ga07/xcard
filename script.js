// グローバル変数
let uploadedImage = null;
let imageBase64 = null;
let currentFormData = {};
let githubSettings = {
    username: '',
    repo: '',
    branch: 'main'
};

// LocalStorageから設定を読み込み
function loadSettings() {
    const saved = localStorage.getItem('githubSettings');
    if (saved) {
        githubSettings = JSON.parse(saved);
        document.getElementById('githubUsername').value = githubSettings.username || '';
        document.getElementById('githubRepo').value = githubSettings.repo || '';
        document.getElementById('githubBranch').value = githubSettings.branch || 'main';
    }
}

// 設定を保存
function saveSettings() {
    githubSettings.username = document.getElementById('githubUsername').value;
    githubSettings.repo = document.getElementById('githubRepo').value;
    githubSettings.branch = document.getElementById('githubBranch').value || 'main';
    
    localStorage.setItem('githubSettings', JSON.stringify(githubSettings));
    
    const statusEl = document.getElementById('settingsStatus');
    statusEl.textContent = '✓ 設定を保存しました！';
    statusEl.className = 'settings-status success';
    
    setTimeout(() => {
        statusEl.textContent = '';
        statusEl.className = 'settings-status';
    }, 3000);
}

// GitHub Pages URLを生成
function generateGitHubPagesUrl(filename) {
    if (!githubSettings.username || !githubSettings.repo) {
        return `https://your-username.github.io/your-repo/${filename}.html`;
    }
    return `https://${githubSettings.username}.github.io/${githubSettings.repo}/${filename}.html`;
}

// Gitコマンドを生成
function generateGitCommands(filename) {
    const commands = [
        `git add ${filename}.html`,
        `git commit -m "Add link card: ${filename}"`,
        `git push origin ${githubSettings.branch || 'main'}`
    ];
    return commands.join('\n');
}

// DOM要素の取得
const cardForm = document.getElementById('cardForm');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');
const previewBtn = document.getElementById('previewBtn');
const previewSection = document.getElementById('preview');
const previewContent = document.getElementById('previewContent');
const resultSection = document.getElementById('result');
const downloadBtn = document.getElementById('downloadBtn');
const copyUrlBtn = document.getElementById('copyUrlBtn');
const deployBtn = document.getElementById('deployBtn');
const deploymentUrlInput = document.getElementById('deploymentUrl');
const commandPreview = document.getElementById('commandPreview');
const toggleSettingsBtn = document.getElementById('toggleSettings');
const settingsPanel = document.getElementById('settingsPanel');
const saveSettingsBtn = document.getElementById('saveSettings');

// 初期化
loadSettings();

// 設定パネルの表示/非表示
toggleSettingsBtn.addEventListener('click', function() {
    if (settingsPanel.style.display === 'none') {
        settingsPanel.style.display = 'block';
    } else {
        settingsPanel.style.display = 'none';
    }
});

// 設定保存
saveSettingsBtn.addEventListener('click', saveSettings);

// 画像アップロードのプレビュー
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        uploadedImage = file;
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imageBase64 = e.target.result;
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="プレビュー">`;
            imagePreview.classList.remove('empty');
        };
        
        reader.readAsDataURL(file);
    }
});

// プレビュー機能
previewBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const url = document.getElementById('url').value;
    
    if (!title || !url || !uploadedImage) {
        alert('タイトル、URL、画像は必須項目です。');
        return;
    }
    
    // プレビューカードを表示
    previewContent.innerHTML = `
        <div class="preview-card">
            <img src="${imageBase64}" alt="${title}" class="preview-card-image">
            <div class="preview-card-content">
                <div class="preview-card-title">${escapeHtml(title)}</div>
                ${description ? `<div class="preview-card-description">${escapeHtml(description)}</div>` : ''}
                <div class="preview-card-url">${escapeHtml(url)}</div>
            </div>
        </div>
    `;
    
    previewSection.style.display = 'block';
    previewSection.scrollIntoView({ behavior: 'smooth' });
});

// フォーム送信（リンクカード生成）
cardForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const url = document.getElementById('url').value;
    const filename = document.getElementById('filename').value || 'card';
    
    if (!uploadedImage) {
        alert('画像をアップロードしてください。');
        return;
    }
    
    // フォームデータを保存
    currentFormData = {
        title,
        description,
        url,
        filename,
        imageBase64
    };
    
    // HTMLを生成
    const htmlContent = generateCardHTML(title, description, url, imageBase64);
    
    // ダウンロード準備
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const downloadUrl = URL.createObjectURL(blob);
    
    downloadBtn.onclick = function() {
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${filename}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    
    // GitHub PagesのURLを生成
    const githubPagesUrl = generateGitHubPagesUrl(filename);
    deploymentUrlInput.value = githubPagesUrl;
    
    // URLコピー
    copyUrlBtn.onclick = function() {
        deploymentUrlInput.select();
        navigator.clipboard.writeText(githubPagesUrl).then(() => {
            const originalText = copyUrlBtn.textContent;
            copyUrlBtn.textContent = '✓ コピーしました！';
            setTimeout(() => {
                copyUrlBtn.textContent = originalText;
            }, 2000);
        });
    };
    
    // Gitコマンド生成とコピー
    const gitCommands = generateGitCommands(filename);
    commandPreview.textContent = gitCommands;
    
    deployBtn.onclick = function() {
        navigator.clipboard.writeText(gitCommands).then(() => {
            const originalText = deployBtn.textContent;
            deployBtn.textContent = '✓ コマンドをコピーしました！';
            setTimeout(() => {
                deployBtn.textContent = originalText;
            }, 2000);
        });
    };
    
    // 結果セクションを表示
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
});

// リンクカードHTML生成関数
function generateCardHTML(title, description, url, imageData) {
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    
    <!-- Open Graph Protocol (OGP) for X/Twitter -->
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${imageData}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:type" content="website" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${imageData}" />
    
    <!-- Redirect to target URL -->
    <meta http-equiv="refresh" content="0; url=${escapeHtml(url)}" />
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
        }
        .container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
        }
        h1 {
            margin-bottom: 20px;
            color: #333;
        }
        p {
            color: #666;
            margin-bottom: 20px;
        }
        .redirect-link {
            display: inline-block;
            padding: 12px 24px;
            background: #1DA1F2;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: background 0.3s;
        }
        .redirect-link:hover {
            background: #1a8cd8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${escapeHtml(title)}</h1>
        ${description ? `<p>${escapeHtml(description)}</p>` : ''}
        <p>自動的にリダイレクトされない場合は、下のリンクをクリックしてください。</p>
        <a href="${escapeHtml(url)}" class="redirect-link">ページに移動</a>
    </div>
    
    <script>
        // JavaScript によるリダイレクト (念のため)
        setTimeout(function() {
            window.location.href = "${escapeHtml(url)}";
        }, 100);
    </script>
</body>
</html>`;
}

// HTMLエスケープ関数
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// 初期状態で画像プレビューにemptyクラスを追加
imagePreview.classList.add('empty');
