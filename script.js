var menuitems= document.getElementById("menuitems");
menuitems.style.maxHeight="0px";

function menutoggle(){
    if(menuitems.style.maxHeight=="0px"){
        menuitems.style.maxHeight="200px";
    }else{
        menuitems.style.maxHeight="0px";
    }
}

var ProductImg = document.getElementById("ProductImg");
var SmallImg = document.getElementsByClassName("small-img")

SmallImg[0].onclick =function(){
    ProductImg.src = SmallImg[0].src;
}
SmallImg[1].onclick =function(){
    ProductImg.src = SmallImg[1].src;
}
SmallImg[2].onclick =function(){
    ProductImg.src = SmallImg[2].src;
}
SmallImg[3].onclick =function(){
    ProductImg.src = SmallImg[3].src;
}
// Function to load the cart from localStorage and update the cart table
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTable = document.getElementById('cart-table');
    const subtotalPriceElement = document.getElementById('subtotal-price');
    const totalPriceElement = document.getElementById('total-price');

    // Clear previous cart rows
    cartTable.innerHTML = `
        <tr>
            <th>Product</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Subtotal</th>
        </tr>
    `;

    let subtotal = 0;

    if (cart.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="4">Your cart is empty.</td>`;
        cartTable.appendChild(emptyRow);
    } else {
        cart.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="cart-info">
                        <img src="${product.imageUrl}" alt="${product.name}" width="50">
                        <div>
                            <p>${product.name}</p>
                            <small>Price: $${product.price}</small>
                            <br>
                            <a href="javascript:void(0);" onclick="removeItem('${product.id}')">Remove</a>
                        </div>
                    </div>
                </td>
                <td>${product.size}</td>
                <td>
                    <input type="number" value="${product.quantity}" min="1" max="3" 
                        oninput="updateQuantity(this, ${product.price}, '${product.id}')">
                </td>
                <td class="subtotal" data-price="${product.price}">$${(product.price * product.quantity).toFixed(2)}</td>
            `;
            cartTable.appendChild(row);
            subtotal += product.price * product.quantity;
        });
    }

    // Update totals
    updateTotal(subtotal);
}


// Function to update the total price (including tax and voucher discount)
function updateTotal(subtotal) {
    const tax = subtotal * 0.1;  // Assuming 10% tax
    let total = subtotal + tax;

    // Apply voucher discount if applicable
    const voucherDiscount = parseFloat(localStorage.getItem('voucher-discount')) || 0;
    total = total - (total * voucherDiscount);

    // Update displayed prices
    document.getElementById('subtotal-price').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax-price').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total-price').textContent = `$${total.toFixed(2)}`;
}

// Function to update quantity and subtotal for a product
function updateQuantity(input, price, productId) {
    const newQuantity = parseInt(input.value);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Find the product in the cart and update its quantity
    const product = cart.find(p => p.id === productId);
    if (product) {
        product.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Update subtotal for this product
    const subtotalElement = input.closest('tr').querySelector('.subtotal');
    subtotalElement.textContent = `$${(price * newQuantity).toFixed(2)}`;
    loadCart();  // Recalculate the cart totals
}

// Function to remove an item from the cart
function removeItem(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.filter(product => product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    loadCart();  // Reload the cart after removal
}
// Function to add a product to the cart (called when the product is added)
function addToCart(productName, price, imageUrl) {
    // Get selected size and quantity
    const size = document.querySelector('select').value;  // Get the selected size
    const quantity = document.getElementById('product-quantity').value;  // Get the selected quantity

    // If no size is selected, prompt the user to select one
    if (size === "Select Size") {
        alert("Please select a size.");
        return;
    }

    // Create the product object
    const productId = `${productName}-${size}`; // Unique ID for product with size
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingProduct = cart.find(product => product.id === productId);
    
    if (existingProduct) {
        existingProduct.quantity += parseInt(quantity);  // Increment quantity if product already exists
    } else {
        const newProduct = {
            id: productId, 
            name: productName,
            price: price, 
            imageUrl: imageUrl, 
            size: size, 
            quantity: parseInt(quantity)
        };
        cart.push(newProduct);  // Add new product if not in the cart
    }

    localStorage.setItem('cart', JSON.stringify(cart));  // Save cart to localStorage
    alert(`${productName} - Size: ${size} has been added to your cart!`);
    loadCart();  // Reload the cart to show updated product details
}


// Function to apply the voucher discount
function applyVoucher() {
    const voucherCode = document.getElementById('voucher-code').value.trim();
    const validVoucherCode = "abtolele25";

    if (voucherCode === validVoucherCode) {
        alert("Voucher applied! 25% discount.");

        localStorage.setItem('voucher-discount', '0.25');  
    } else {
        alert("Invalid voucher code.");
        localStorage.setItem('voucher-discount', '0');  
    }

    loadCart();  
}

// Call loadCart on page load to populate the cart
window.onload = loadCart;

// Function to sort products based on the selected option
function sortProducts() {
    var sortOption = document.getElementById("sortOptions").value; // Get the selected option
    var products = Array.from(document.getElementsByClassName("product")); // Get all product elements
    
    if (sortOption === "priceAsc") {
        // Sort products by price in ascending order
        products.sort(function(a, b) {
            return parseFloat(a.getAttribute("data-price")) - parseFloat(b.getAttribute("data-price"));
        });
    } else if (sortOption === "priceDesc") {
       
        products.sort(function(a, b) {
            return parseFloat(b.getAttribute("data-price")) - parseFloat(a.getAttribute("data-price"));
        });
    } else if (sortOption === "rating") {
    
        products.sort(function(a, b) {
            return parseFloat(b.getAttribute("data-rating")) - parseFloat(a.getAttribute("data-rating"));
        });
    }

    // Reorder the products in the DOM
    var productList = document.getElementById("productList");
    productList.innerHTML = ""; // Clear the existing product list
    products.forEach(function(product) {
        productList.appendChild(product); // Append the sorted product back into the list
    });
}

// Attach the sortProducts function to the select dropdown on change event
document.getElementById("sortOptions").addEventListener("change", sortProducts);
