document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

function fetchProducts() {
    const token = localStorage.getItem("token");
    const productUrl =
        window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1")
            ? "http://localhost:8080/api/products"
            : "https://9bf0-45-127-59-91.ngrok-free.app/api/products";

    fetch(productUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    })
        .then(async (response) => {
            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to fetch products");
            }

            if (!contentType.includes("application/json")) {
                throw new Error("Expected JSON, got non-JSON response");
            }

            return response.json();
        })
        .then((products) => {
            renderProducts(products);
        })
        .catch((err) => {
            console.error("❌ Product Fetch Error:", err.message);
        });
}

// Render products to DOM
function renderProducts(products) {
    const productList = document.getElementById("product-list");
    const template = document.getElementById("product-template");

    products.forEach((product) => {
        const productCard = template.content.cloneNode(true);

        productCard.querySelector(".product-id").textContent = product.id;
        productCard.querySelector("img").src = product.imageUrl || "https://via.placeholder.com/200";
        productCard.querySelector("img").alt = product.name;
        productCard.querySelector("h3").textContent = product.name;
        productCard.querySelector(".category").textContent = product.category;
        productCard.querySelector(".price").textContent = product.price;

        productCard.querySelector(".add-cart").addEventListener("click", () => {
            addToCart(product.id);
        });

        productList.appendChild(productCard);
    });
}
