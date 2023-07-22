function gh(ghp) {
    ghp = ghp.join(' ').split(',');
    const p0 = ghp[0].trim();
    const p1 = ghp[1].trim();
    return `<a href='https://github.com/${p0}' style='border:none !important; box-shadow:none !important; margin:0!important;'><img src="https://streak-stats.demolab.com?user=${p0}&theme=${p1}&locale=zh_Hans"></a>`;
}
hexo.extend.tag.register('ghp', gh);
function ghp(ghpt) {
    ghpt = ghpt.join(' ').split(',');
    const p0 = ghpt[0].trim();
    const p1 = ghpt[1].trim();
    const p2 = ghpt[2].trim();
    const p3 = ghpt[3].trim();
    return `<a href='https://github.com/${p0}' style='border:none!important; box-shadow:none!important; margin:none!important;'><img src='https://github-profile-trophy.vercel.app/?username=${p0}&row=${p1}&column=${p2}&theme=${p3}'></a>`;
}
hexo.extend.tag.register('ghpt', ghp);