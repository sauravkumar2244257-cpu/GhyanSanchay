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
            title: row.c[1]?.v || 'Untitled',
            date: row.c[2]?.v || '',
            category: row.c[3]?.v || 'General',
            image: row.c[4]?.v || 'default-image.jpg',
            excerpt: row.c[5]?.v || '',
            content: row.c[6]?.v || ''
        }));
        
myBlogs.reverse();
        // Render logic based on page
        if (document.getElementById('blog-container')) {
            renderBlogs(myBlogs);
        }
        
        if (window.location.pathname.includes('post.html')) {
            handleSinglePost();
        }
    } catch (error) {
        console.error("Data fetch error:", error);
    }
}

function renderBlogs(blogsToDisplay) {
    const container = document.getElementById('blog-container');
    if (!container) return;

    if (blogsToDisplay.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>Maaf kijiyega, koi result nahi mila.</p>";
        return;
    }

    container.innerHTML = blogsToDisplay.map(blog => `
        <article class="post" onclick="location.href='post.html?id=${blog.id}'" style="cursor: pointer;">
        <a href="post.html?id=${blog.id}" style="text-decoration: none; color: inherit; display: block;">
            <img src="${blog.image}" class="blog-img" alt="${blog.title}">
            <div class="post-info">
                <h2>${blog.title}</h2>
                <p class="meta">${blog.date} | <b>${blog.category}</b></p>
                <p>${blog.excerpt}</p>
                <span class="read-more" style="color: #007bff; font-weight: bold;">Read More →</span>
            </div>
        </article>
    `).join('');
}

    function handleSinglePost() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const blog = myBlogs.find(b => b.id == id);;

    if (blog) {
        document.getElementById('post-title').innerText = blog.title;
        document.getElementById('post-date').innerText = "Post kiya gaya: " + blog.date;
        document.getElementById('post-image').src = blog.image;
        document.getElementById('post-content').innerHTML = blog.content;
    }
}

function filterByCategory(cat) {
    const filtered = (cat === 'All') ? myBlogs : myBlogs.filter(b => b.category.toLowerCase() === cat.toLowerCase());
    renderBlogs(filtered);
}

// Search Logic
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    if (searchBtn && searchInput) {
        const performSearch = () => {
            const term = searchInput.value.toLowerCase();
            const filtered = myBlogs.filter(b => b.title.toLowerCase().includes(term) || b.category.toLowerCase().includes(term));
            renderBlogs(filtered);
        };
        searchBtn.addEventListener('click', performSearch);
    }
});

fetchBlogs();

const shareBlog = async () => {
    const shareData = {
        title: document.title, // Blog ka title
        text: 'Ghyan Sanchay par is post ko zaroor padhein:', // Description
        url: window.location.href, // Current Page ka URL (Dynamic)
    };

    try {
        if (navigator.share) {
            // Mobile devices aur Chrome ke liye best
            await navigator.share(shareData);
        } else {
            // Fallback: Agar browser support nahi karta (WhatsApp Direct Link)
            const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`;
            window.open(waUrl, '_blank');
        }
    } catch (err) {
        console.error('Error sharing:', err);
    }
};

// Is code ko apne script.js ya HTML ke niche <script> tag mein daalein
const menuIcon = document.querySelector('.menu-icon'); // Check karein aapki class ka naam kya hai
const sidebar = document.querySelector('.sidebar');

menuIcon.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});
