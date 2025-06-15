// Import Supabase SDK (Make sure you have it installed in your project)
import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const SUPABASE_URL = "https://sskrymxsuyiburhkkufh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Shopping Cart Storage
let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

// Ensure Elements Exist Before Manipulation
function getElement(id) {
    return document.getElementById(id) || console.error(`Element #${id} not found`);
}

// Fetch Products
async function fetchProducts() {
    try {
        const { data, error } = await supabase.from("Products").select("*");
        if (error) throw error;
        displayProducts(data);
    } catch (err) {
        console.error("Error fetching products:", err.message);
    }
}

// Display Products in UI
function displayProducts(products) {
    const container = getElement("product-container");
    if (!container) return;

    container.innerHTML = "";
    products.forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <img src="${product.image_url}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Price: ${product.price}</p>
                <button onclick="addToCart('${product.id}', '${product.name}', '${product.price}')">Add to Cart</button>
            </div>`;
    });
}

// Add Product to Cart
function addToCart(id, name, price) {
    cart.push({ id, name, price });
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    alert(`${name} added to cart!`);
    updateCart();
}

// Remove Product from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    updateCart();
}

// Update Cart Display
function updateCart() {
    const cartContainer = getElement("cart-container");
    if (!cartContainer) return;

    cartContainer.innerHTML = "";
    cart.forEach((item, index) => {
        cartContainer.innerHTML += `
            <p>${item.name} - ${item.price} <button onclick="removeFromCart(${index})">Remove</button></p>
        `;
    });
}

// Checkout via Mpesa (Placeholder for Actual Integration)
function checkout() {
    if (cart.length === 0) return alert("Your cart is empty!");

    const totalAmount = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
    const phoneNumber = prompt("Enter Mpesa Number:");
    alert(`Processing Mpesa payment of KES ${totalAmount} for ${phoneNumber}...`);

    cart = [];
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    updateCart();
}

// Submit Testimonial
async function submitTestimonial() {
    const name = prompt("Enter your name:");
    const testimony = prompt("Enter your testimonial:");
    if (name && testimony) {
        try {
            await supabase.from("Testimonials").insert([{ name, testimony }]);
            alert("Testimonial added!");
            fetchTestimonials();
        } catch (err) {
            console.error("Error submitting testimonial:", err.message);
        }
    }
}

// Fetch Testimonials
async function fetchTestimonials() {
    try {
        const { data, error } = await supabase.from("Testimonials").select("*");
        if (error) throw error;
        displayTestimonials(data);
    } catch (err) {
        console.error("Error fetching testimonials:", err.message);
    }
}

// Display Testimonials
function displayTestimonials(testimonials) {
    const container = getElement("testimonial-container");
    if (!container) return;

    container.innerHTML = testimonials.map(testimonial =>
        `<p><strong>${testimonial.name}</strong>: ${testimonial.testimony}</p>`
    ).join("");
}

// Upload Blog Post
async function submitBlog() {
    const title = prompt("Enter blog title:");
    const content = prompt("Enter blog content:");
    if (title && content) {
        try {
            await supabase.from("Blogs").insert([{ title, content }]);
            alert("Blog added!");
            fetchBlogs();
        } catch (err) {
            console.error("Error submitting blog:", err.message);
        }
    }
}

// Fetch & Display Blogs
async function fetchBlogs() {
    try {
        const { data, error } = await supabase.from("Blogs").select("*");
        if (error) throw error;
        const container = getElement("blog-container");
        if (!container) return;
        container.innerHTML = data.map(blog =>
            `<h3>${blog.title}</h3><p>${blog.content}</p><hr>`
        ).join("");
    } catch (err) {
        console.error("Error fetching blogs:", err.message);
    }
}

// Upload Project Video
async function submitProject() {
    const name = prompt("Enter project name:");
    const description = prompt("Enter project description:");
    const videoURL = prompt("Enter video link:");
    if (name && description && videoURL) {
        try {
            await supabase.from("Projects").insert([{ name, description, video_url: videoURL }]);
            alert("Project added!");
            fetchProjects();
        } catch (err) {
            console.error("Error submitting project:", err.message);
        }
    }
}

// Fetch & Display Projects
async function fetchProjects() {
    try {
        const { data, error } = await supabase.from("Projects").select("*");
        if (error) throw error;
        const container = getElement("project-container");
        if (!container) return;
        container.innerHTML = data.map(project =>
            `<div class="project-card">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <video src="${project.video_url}" controls></video>
            </div>`
        ).join("");
    } catch (err) {
        console.error("Error fetching projects:", err.message);
    }
}

// Admin Authentication
async function authenticateAdmin() {
    const passkeyInput = prompt("Enter Passkey:");
    try {
        const { data, error } = await supabase.from("Admins").select("*").eq("passkey", passkeyInput);
        if (error || data.length === 0) return alert("Access Denied: Incorrect Passkey!");

        alert("Access Granted: You can modify content.");
        modifyContent();
    } catch (err) {
        console.error("Error during authentication:", err.message);
    }
}

// Placeholder for Content Modification Logic
function modifyContent() {
    console.log("Modify products, blogs, testimonials, and projects logic goes here...");
}

// Search Functionality
getElement("search")?.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    document.querySelectorAll(".product-card").forEach(card =>
        card.style.display = card.innerText.toLowerCase().includes(query) ? "block" : "none"
    );
});

// Trigger Admin Authentication
getElement("modify-btn")?.addEventListener("click", authenticateAdmin);

// Initialize App
fetchProducts();
fetchTestimonials();
fetchBlogs();
fetchProjects();
updateCart();
