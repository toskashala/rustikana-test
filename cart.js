document.addEventListener('DOMContentLoaded', function() {
    function displayCartItems() {
        const cartContainer = document.getElementById('cart-container');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="empty">Your cart is empty</p>';
            return;
        }

        cartContainer.innerHTML = `
            <table class="table">
                <thead class = "table-column">
                    <tr>
                        <th scope="col">Item</th>
                        <th scope="col" class="text-center price-column">Price</th>
                        <th scope="col" class="text-center quantity-column">Quantity</th>
                        <th scope="col" class="text-center total-column">Total</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody id="cart-items"></tbody>
            </table>
        `;

        const cartItems = document.getElementById('cart-items');

        cart.forEach(item => {
            const itemElement = document.createElement('tr');
            itemElement.innerHTML = `
                <td colspan="5">
                    <div class="cart-item-box">
                        <div class="item-details">
                            <div class="item-img">
                                <img src="${item.img}" alt="${item.name}">
                            </div>
                            <div>
                                <h5>${item.name}</h5>
                                <p>${item.description}</p>
                            </div>
                        </div>
                        <div class="price-total-remove">
                            <div class="price">${item.price} <span class="currency">DEN</span></div>
                            <div class="quantity-container">
                                <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity('${item.id}', -1)">-</button>
                                <input type="text" class="form-control" value="${item.quantity}" readonly>
                                <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity('${item.id}', 1)">+</button>
                            </div>
                            <div class="total">${item.price * item.quantity} <span class="currency">DEN</span></div>
                            <div>
                                <img src="img/garbage-bin.png" alt="Remove" class="remove-icon" onclick="removeFromCart('${item.id}')">
                            </div>
                        </div>
                    </div>
                </td>
            `;
            cartItems.appendChild(itemElement);
        });

        updateTotalAmount();
    }

    window.updateQuantity = function(itemId, change) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(cartItem => cartItem.id === itemId);

        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity < 1) {
                cart[itemIndex].quantity = 1;
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
        }
    };

    window.removeFromCart = function(itemId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(cartItem => cartItem.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    };

    function updateTotalAmount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        document.getElementById('total-amount').textContent = totalAmount;
    }

    // Function to show the order success modal
    function showOrderSuccessModal() {
        const orderSuccessModal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
        orderSuccessModal.show();
    }

    // Function to show the empty cart modal
    function showEmptyCartModal() {
        const emptyCartModal = new bootstrap.Modal(document.getElementById('emptyCartModal'));
        emptyCartModal.show();
    }

    // Function to show the invalid table number modal
    function showInvalidTableNumberModal() {
        const invalidTableNumberModal = new bootstrap.Modal(document.getElementById('invalidTableNumberModal'));
        invalidTableNumberModal.show();
    }

    // Function to show the empty table number modal
    function showEmptyTableNumberModal() {
        const emptyTableNumberModal = new bootstrap.Modal(document.getElementById('emptyTableNumberModal'));
        emptyTableNumberModal.show();
    }

    document.getElementById('send-order').addEventListener('click', async () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const comments = document.getElementById('comments').value;
        const tableNumber = document.getElementById('tableNumber').value;

        if (cart.length === 0) {
            showEmptyCartModal();
            return;
        }

        if (!tableNumber.trim()) {
            showEmptyTableNumberModal();
            return;
        }

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items: cart, comments, tableNumber })
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                if (errorDetails.message === 'Invalid table number') {
                    showInvalidTableNumberModal();
                } else {
                    throw new Error(errorDetails.message || 'Failed to send order');
                }
            } else {
                const result = await response.json();
                if (result.success) {
                    showOrderSuccessModal();
                    localStorage.removeItem('cart');
                    displayCartItems();
                    document.getElementById('comments').value = '';
                    document.getElementById('tableNumber').value = '';
                } else {
                    showInvalidTableNumberModal();
                }
            }
        } catch (error) {
            alert(error.message);
            console.error('Error sending order:', error);
        }
    });

    // Display cart items if on cart.html
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
});
