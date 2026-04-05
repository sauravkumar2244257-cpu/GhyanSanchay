const sheetId = '1wqVrv-prG-XoCziEL0X3RhyKixZGZINiZSoY5cqUo8k';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

let myBlogs = [];

async function fetchBlogs() {
    try {
        const response = await fetch(base);
        const text = await response.text();
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));
        const rows = jsonData.table.rows;

        myBlogs = rows.map((row, index) => ({
            id: index,
            title: row.c[1] ? row.c[1].v : 'Untitled',
            date: row.c[2] ? row.c[2].v : '',
            category: row.c[3] ? row.c[3].v : 'General',
            image: row.c[4] ? row.c[4].v : '',
            excerpt: row.c[5] ? row.c[5].v : '',
            content: row.c[6] ? row.c[6].v : ''
        }));

        // Page check logic
        if (document.getElementById('blog-container')) {
            renderBlogs(myBlogs);
        }
        
        if (window.location.pathname.includes('post.html')) {
            handleSinglePost();
        }

    } catch (error) {
        console.error("Data load nahi hua:", error);
    }
}

function renderBlogs(blogsToDisplay) {
    const container = document.getElementById('blog-container');
    if (!container) return;

    if (blogsToDisplay.length === 0) {
        container.innerHTML = "<p style='padding:20px; text-align:center;'>Maaf kijiyega, koi result nahi mila.</p>";
        return;
    }

    container.innerHTML = blogsToDisplay.map((blog) => `
        <article class="post">
            <img src="${blog.image}" class="blog-img" alt="${blog.title}">
            <div class="post-info">
                <h2>${blog.title}</h2>
                <p class="meta">${blog.date} | <b>${blog.category}</b></p>
                <p>${blog.excerpt}</p>
                <a href="post.html?id=${blog.id}" class="read-more">Read More</a>
            </div>
        </article>
    `).join('');
}

function handleSinglePost() {
    const params = new URLSearchParams(window.location.search);
    const blogId = params.get('id');

    if (blogId !== null && myBlogs[blogId]) {
        const blog = myBlogs[blogId];
        const titleEl = document.getElementById('post-title');
        if (titleEl) {
            titleEl.innerText = blog.title;
            document.getElementById('post-date').innerText = "Post kiya gaya: " + blog.date;
            document.getElementById('post-image').src = blog.image;
            document.getElementById('post-content').innerHTML = blog.content;
        }
    }
}

// Filter Logic
function filterByCategory(catName) {
    const filtered = (catName === 'All') 
        ? myBlogs 
        : myBlogs.filter(blog => blog.category.toLowerCase() === catName.toLowerCase());
    renderBlogs(filtered);
}

// Search Setup
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    if (searchBtn && searchInput) {
        const performSearch = () => {
            const term = searchInput.value.toLowerCase().trim();
            const filtered = myBlogs.filter(blog => 
                blog.title.toLowerCase().includes(term) || 
                blog.category.toLowerCase().includes(term)
            );
            renderBlogs(filtered);
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
    }
});

fetchBlogs();