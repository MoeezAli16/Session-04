document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const addProductForm = document.getElementById('add-product-form');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productCategory = document.getElementById('product-category');
    const productDescription = document.getElementById('product-description');

    const editProductForm = document.getElementById('edit-product-form');
    const editProductName = document.getElementById('edit-product-name');
    const editProductPrice = document.getElementById('edit-product-price');
    const editProductCategory = document.getElementById('edit-product-category');
    const editProductDescription = document.getElementById('edit-product-description');

    let currentProductId = null;

    async function fetchProducts() {
        const res = await fetch('/products');
        const products = await res.json();
        productList.innerHTML = ''; 

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <strong>${product.name}</strong><br>
                Price: $${product.price}<br>
                Category: ${product.category}<br>
                Description: ${product.description}<br>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
                <button class="edit-btn" data-id="${product.id}">Edit</button>
            `;
            productList.appendChild(productItem);
        });
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                deleteProduct(id); 
            });
        });

        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id; 
                loadProductForEdit(id); 
            });
        });
    }

    async function loadProductForEdit(id) {
        const res = await fetch(`/products/${id}`);
        const product = await res.json();
        if (res.ok) {
            currentProductId = product.id;
            editProductName.value = product.name;
            editProductPrice.value = product.price;
            editProductCategory.value = product.category;
            editProductDescription.value = product.description;
            editProductForm.style.display = 'block';
        } else {
            alert('Product not found');
        }
    }

    // Add a new product
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newProduct = {
            name: productName.value,
            price: parseFloat(productPrice.value),
            category: productCategory.value,
            description: productDescription.value
        };

        const res = await fetch('/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        const addedProduct = await res.json();
        fetchProducts(); 
        addProductForm.reset(); 
    });


    editProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedProduct = {
            name: editProductName.value,
            price: parseFloat(editProductPrice.value),
            category: editProductCategory.value,
            description: editProductDescription.value
        };

        const res = await fetch(`/products/${currentProductId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        });

        if (res.ok) {
            fetchProducts(); 
            editProductForm.style.display = 'none'; 
            editProductForm.reset(); 
        } else {
            alert('Failed to update product');
        }
    });
    async function deleteProduct(id) {
        const res = await fetch(`/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
            fetchProducts(); 
        }
    }
    fetchProducts();
});
