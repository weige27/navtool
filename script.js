document.addEventListener('DOMContentLoaded', function() {
    const langZh = document.getElementById('lang-zh');
    const langEn = document.getElementById('lang-en');
    const body = document.body;
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const cards = document.querySelectorAll('.card');
    
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
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        let foundResults = false;
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                card.style.display = 'block';
                foundResults = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // 更新URL以反映搜索状态
        if (searchTerm.length > 0) {
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('search', searchTerm);
            window.history.pushState({}, '', newUrl);
        } else {
            const newUrl = new URL(window.location);
            newUrl.searchParams.delete('search');
            window.history.pushState({}, '', newUrl);
        }
        
        // 显示搜索结果数量
        updateSearchResultsCount(foundResults);
    }
    
    function updateSearchResultsCount(foundResults) {
        // 获取所有可见卡片的数量
        const visibleCards = document.querySelectorAll('.card[style="display: block;"]');
        const count = visibleCards.length;
        
        // 更新结果计数或显示无结果消息
        const countElem = document.getElementById('search-count');
        if (countElem) {
            if (foundResults) {
                countElem.textContent = `找到 ${count} 个结果 | Found ${count} results`;
                countElem.style.display = 'block';
            } else {
                countElem.textContent = '未找到结果 | No results found';
                countElem.style.display = 'block';
            }
        }
    }
    
    // 检查URL中是否有搜索参数
    function checkUrlForSearch() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        
        if (searchParam) {
            searchInput.value = searchParam;
            performSearch();
        }
    }
    
    // 添加事件监听器
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 页面加载时检查URL
    checkUrlForSearch();

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 减去头部固定高度
                    behavior: 'smooth'
                });
            }
        });
    });

    // 添加滚动检测，在滚动一定距离后改变头部样式
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 初始加载页面时显示动画效果
    setTimeout(function() {
        document.querySelectorAll('.card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('appear');
            }, 50 * index);
        });
    }, 300);
}); 