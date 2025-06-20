document.addEventListener('DOMContentLoaded', function() {
    const langZh = document.getElementById('lang-zh');
    const langEn = document.getElementById('lang-en');
    const body = document.body;
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const cards = document.querySelectorAll('.card');
    const sections = document.querySelectorAll('.section');
    
    // 修复卡片结构，确保整个卡片可点击
    fixCardStructure();
    
    // 语言切换功能
    langZh.addEventListener('click', function() {
        body.classList.remove('en-mode');
        langZh.classList.add('active');
        langEn.classList.remove('active');
        localStorage.setItem('lang', 'zh');
    });
    
    langEn.addEventListener('click', function() {
        body.classList.add('en-mode');
        langEn.classList.add('active');
        langZh.classList.remove('active');
        localStorage.setItem('lang', 'en');
    });
    
    // 检查保存的语言首选项
    if(localStorage.getItem('lang') === 'en') {
        body.classList.add('en-mode');
        langEn.classList.add('active');
        langZh.classList.remove('active');
    }
    
    // 搜索功能
    const searchCount = document.getElementById('search-count');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        let visibleCards = 0;
        
        // 如果搜索框为空，显示所有卡片和部分
        if (searchTerm === '') {
            cards.forEach(card => {
                card.style.display = '';
            });
            sections.forEach(section => {
                section.style.display = '';
            });
            searchCount.style.display = 'none';
            // 更新URL，移除search参数
            const url = new URL(window.location);
            url.searchParams.delete('search');
            window.history.pushState({}, '', url);
            return;
        }
        
        // 隐藏所有部分，稍后根据包含匹配卡片的部分显示
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                card.style.display = '';
                card.closest('.section').style.display = '';
                visibleCards++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // 显示搜索结果计数
        searchCount.textContent = `找到 ${visibleCards} 个结果 | Found ${visibleCards} results`;
        searchCount.style.display = 'block';
        
        // 更新URL，添加search参数
        const url = new URL(window.location);
        url.searchParams.set('search', searchTerm);
        window.history.pushState({}, '', url);
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 检查URL中是否有搜索参数
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
        searchInput.value = searchParam;
        performSearch();
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    // 更新面包屑导航
                    updateBreadcrumb(targetId);
                }
            }
        });
    });
    
    // 滚动时改变头部样式
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // 更新面包屑导航
        updateBreadcrumbOnScroll();
    });
    
    // 卡片初始动画效果
    const allCards = document.querySelectorAll('.card');
    allCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
        card.classList.add('fade-in');
    });
    
    // 修复卡片结构，确保整个卡片可点击
    function fixCardStructure() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const link = card.querySelector('a');
            const title = card.querySelector('h3');
            
            // 如果标题不在链接内，则将其移入链接
            if (link && title && !link.contains(title)) {
                // 创建新的链接元素，保留原链接的属性
                const newLink = document.createElement('a');
                newLink.href = link.href;
                newLink.target = link.target;
                
                // 将标题移入新链接
                newLink.appendChild(title.cloneNode(true));
                
                // 将原链接的内容移入新链接
                while (link.firstChild) {
                    newLink.appendChild(link.firstChild);
                }
                
                // 替换原链接和标题
                card.replaceChild(newLink, title);
                if (link.parentNode) {
                    link.parentNode.removeChild(link);
                }
            }
        });
    }
    
    // 执行卡片结构修复
    fixCardStructure();
    
    // 面包屑导航功能
    const breadcrumbNav = document.getElementById('breadcrumb-nav');
    
    // 根据点击的链接更新面包屑
    function updateBreadcrumb(sectionId) {
        // 清除除了首页以外的所有面包屑
        while (breadcrumbNav.children.length > 1) {
            breadcrumbNav.removeChild(breadcrumbNav.lastChild);
        }
        
        if (sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTitle = section.querySelector('h2').textContent.split('|')[0].trim();
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#${sectionId}`;
                a.textContent = sectionTitle;
                a.classList.add('active');
                li.appendChild(a);
                breadcrumbNav.appendChild(li);
            }
        }
    }
    
    // 根据滚动位置更新面包屑
    function updateBreadcrumbOnScroll() {
        const sections = document.querySelectorAll('.section');
        let currentSection = null;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // 如果部分顶部在视口中或刚刚超过视口顶部
            if (rect.top <= 150 && rect.bottom > 0) {
                currentSection = section;
            }
        });
        
        if (currentSection) {
            updateBreadcrumb(currentSection.id);
        }
    }
    
    // 返回顶部功能
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 初始化面包屑
    updateBreadcrumbOnScroll();
}); 