document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    fetch('/api/protected', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.status === 401) {
            window.location.href = '/login.html';
        }
    })
    .catch(error => console.error('Error accessing protected route:', error));

    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.removeItem('token');
        window.location.href = '/login.html';
    });

    fetchTableNumbers();
    fetchOrders();

    async function fetchTableNumbers() {
        try {
            const response = await fetch('/api/table-orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch table numbers');
            }
            const tableNumbers = await response.json();
            displayTableNumbers(tableNumbers);
        } catch (error) {
            console.error('Error fetching table numbers:', error);
        }
    }

    async function fetchOrders() {
        try {
            const response = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const orders = await response.json();
            displayOrders(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    function displayTableNumbers(tableNumbers) {
        const tableNumberList = document.getElementById('table-number-list');
        tableNumberList.innerHTML = ''; // Clear previous content

        tableNumbers.forEach(table => {
            const tableNumberElement = document.createElement('div');
            tableNumberElement.classList.add('col-md-2', 'mb-4');
            tableNumberElement.innerHTML = `
                <div class="table-number-button" onclick="fetchOrderDetails('${table.table_number}')">
                  
                        ${table.table_number}
                  
                </div>
            `;
            tableNumberList.appendChild(tableNumberElement);
        });
    }

    window.fetchOrderDetails = async function(tableNumber) {
        try {
            const orderDetailsContainer = document.getElementById('order-details');
            const response = await fetch(`/api/table-orders/${tableNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch order details');
            }
            const orderDetails = await response.json();
            
            // Check if order details container is already visible
            if (orderDetailsContainer.classList.contains('visible')) {
                // Hide order details container
                orderDetailsContainer.classList.remove('visible');
                orderDetailsContainer.innerHTML = ''; // Clear previous content
            } else {
                // Show order details container
                orderDetailsContainer.classList.add('visible');
                displayOrderDetails(orderDetails);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };
    

    function displayOrders(orders) {
        const orderList = document.getElementById('order-list');
        orderList.innerHTML = ''; // Clear previous content
        if (orders.length === 0) {
            orderList.innerHTML = '<div class="col-12 text-center mt-4 text-muted"><h4>No new orders at the moment</h4></div>';
        } else {
        orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.classList.add('col-md-6', 'mb-4');
            const headerClass = order.status === 'order-done' ? 'bg-secondary' : order.status === 'preparing' ? 'bg-warning' : 'bg-success';
            orderElement.innerHTML = `
                <div class="card">
                    <div class="card-header ${headerClass}">
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge badge-primary">#${order.table_number}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">New Order</h5>
                        <div>${order.menu_item.split(', ').map(item => `<div>${item}</div>`).join('')}</div>
                        <p class="card-text mt-3">Subtotal: <strong>${order.subtotal} DEN</strong></p>
                        <p class="card-text">Table number: <strong>${order.table_number}</strong></p>
                        <p class="card-text">Additional comments: ${order.comments}</p>
                        <div class="btn-group" role="group">
                            <button class="btn btn-success" onclick="updateOrderStatus(${order.id}, 'preparing')">Preparing</button>
                            <button class="btn btn-warning" onclick="updateOrderStatus(${order.id}, 'order-done')">Done</button>
                        </div>
                    </div>
                </div>
            `;
            orderList.appendChild(orderElement);
        });
    }
}
    

    function displayOrderDetails(orderDetails) {
        const orderDetailsContainer = document.getElementById('order-details');
        orderDetailsContainer.innerHTML = ''; // Clear previous content

        orderDetailsContainer.innerHTML = `
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Order Details for Table ${orderDetails.table_number}</h5>
                    </div>
                    <div class="card-body">
                        <p><strong>Items:</strong> ${orderDetails.ordered_items}</p>
                        <p><strong>Total Quantity:</strong> ${orderDetails.total_quantity}</p>
                        <p><strong>Total Subtotal:</strong> ${orderDetails.total_subtotal} DEN</p>
                        <div class="btn-group" role="group">
                            <button class="btn btn-warning" onclick="updateTableOrderStatus('${orderDetails.table_number}', 'table-done')">Done</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }


    function getStatusClass(status) {
        switch (status) {
            case 'new':
                return 'bg-success';
            case 'preparing':
                return 'bg-warning';
            case 'order-done':
                return 'bg-secondary';
            case 'table-done':
                return 'bg-secondary';
            default:
                return '';
        }
    }

    window.updateOrderStatus = async function(orderId, status) {
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (!response.ok) {
                throw new Error('Failed to update order status');
            }
            fetchOrders(); // Refresh the orders list to reflect the status change
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    window.updateTableOrderStatus = async function(tableNumber, status) {
        try {
            const response = await fetch(`/api/table-orders/${tableNumber}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (!response.ok) {
                throw new Error('Failed to update table order status');
            }
            fetchTableNumbers(); // Refresh the table numbers list
            fetchOrders(); // Refresh the orders list
            document.getElementById('order-details').innerHTML = ''; // Clear order details
        } catch (error) {
            console.error('Error updating table order status:', error);
        }
    };
    // Fetch orders and table numbers periodically
fetchOrders();
fetchTableNumbers();
setInterval(fetchOrders, 5000); // Fetch new orders every 5 seconds
setInterval(fetchTableNumbers, 5000); // Fetch table numbers every 5 seconds

});

