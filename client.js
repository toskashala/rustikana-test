document.addEventListener('DOMContentLoaded', function() {
    
    // Map of item names to their respective image URLs
    const imageUrlMap = {
        'The Mighty Irish': 'img/burger4.jpg',
        'The Klassiker': 'img/klassiker.png',
        'Fresh & Creamy': 'img/freshcreamy.jpg',
        'Magic Mushroom': 'img/mushroom.jpg',
        'The Hero': 'img/hero.jpg',
        'Volcano': 'img/volcano.jpg',
        'The Night King': 'img/nightking.jpg',
        'New Yorker': 'img/newyorker.jpg',
        'Double Smash': 'img/doublesmash.webp',
        'Menage A Trois': 'img/menage.jpg',
        'Pulled Pork' : 'img/pulledpork.webp',
        'The Angry Bird' : 'img/angrybird.jpg',
        'Kebap' : 'img/kebap.jpg',
        'Rockstar Kebaps' : 'img/kebap2.webp',
        'Sharska - burger patty' : 'img/patty.jpg',
        'The Baconator':'img/baconator.jpg',
        'Chick Bomb':'img/chickbomb.jpg',
        'Mustard Chicken':'img/mustardchicken.jpg',
        'Shopska':'img/shopska.jpg',
        'Macedonian Salad':'img/mkdsalad.jpg',
        'Mixed Salad' : 'img/mixedsalad.jpg',
        'Valerie' : 'img/valerie.jpg',
        'Delilah' : 'img/delilah.webp',
        'Double Shopska' : 'img/doubleshopska.webp',
        'Tzatziki' : 'img/tzatziki.jpg',
        'Onion Rings' : 'img/onionrings.jpg',
        'French Fries' : 'img/fries.webp',
        'Pulled Pork Sandwich' : 'img/porksandwich.jpg',
        'Breakfast of Champions' : 'img/eggsbacon.jpg',
        'Breakfast Burger' : 'img/breakfastburger.jpg',
        'Sausage Sandwich' : 'img/sausagesandwich.webp',
        'Mushroom Sandwich' : 'img/mushroomsandwich.jpg',
        'Bacon Sandwich' : 'img/baconsandwich2.jpg',
        '2 Egg Omelet with Cheese' : 'img/omlet1.JPG',
        '3 Egg Omelet with Cheese' : 'img/omlet2.jpg',
        'Platter for Beer' : 'img/beerplatter.jpg',
        'Platter for Wine' : 'img/wineplatter.jpg',
        'Platter for Rakija' : 'img/rakijaplatter.jpg',
        'Mezze Platter XXL' : 'img/xxlmezze.jpg',
        'Meat Platter XXL' : 'img/meatplatter.jpg',
        'Royale with Cheese' : 'img/royale.jpg',
        'Grilled Bread Bun' : 'img/grilledbread.jpg',
        'Grilled Bread with Cheese' : 'img/grilledbreadcheese.jpg',
        'Marinated Grilled Pepper' : 'img/grilledpepper.jpg',
        'Heavy Cream (Kajmak)' : 'img/kajmak.jpg',
        'Nuts' : 'img/nuts.jpg',
        'The Umami Bomb' : 'img/umamibom.jpg',
        'Chicken Tenders' : 'img/tenders.webp',
        'Chicken Wings/Drums' : 'img/wings.jpg',
        'Brooklyn Spicy Tenders' : 'img/spicytenders.webp',
        'Veggie All Stars' : 'img/grilledveggies.jpg',
        'Samosas with Gouda & Veggies' : 'img/samosas.jpg',
        'The Fake Zeppelin' : 'img/halloumi.jpg',
        'Sensational New Yorker' : 'img/veganpatty.jpg',
        'Sensational Forrest Gump' : 'img/vegan2.jpg',
        'Coca Cola' : 'img/coke.jpg',
        'Coca Cola Zero' : 'img/cokezero.jpg',
        'Fanta' : 'img/fanta.webp',
        'Sprite' : 'img/sprite.webp',
        'Schweppes Bitter Lemon' : 'img/bitterlemon.jpg',
        'Schweppes Tonic Water' : 'img/tonic.jpg',
        'Next Orange' : 'img/orange.jpg',
        'Next Peach' : 'img/peach.jpg',
        'Skopsko Draft 0.3' : 'img/skopsko2.jpg',
        'Skopsko Draft 0.5' : 'img/skopsko2.jpg',
        'Lasko 0.5' : 'img/lasko.png',
        'Paulaner Helles 0.5' : 'img/paulaner.png',
        'Heineken Pint' : 'img/heineken.webp',
        'Skopsko 0.5' : 'img/skopsko2.jpg',
        'Skopsko Smooth 0.5' : 'img/skopsko2.jpg',
        'Heineken 0.33' : 'img/heineken.webp',
        'Smirnoff' : 'img/smirnoff.jpg',
        'Absolut' : 'img/vodka.webp',
        'Ruski Standard' : 'img/ruski.jpg',
        'Finlandia' : 'img/finlandia.jpg',
        'Olmeca Anejo' : 'img/olmea.webp',
        'Olmeca Blanco' : 'img/olmecawhite.webp',
        'Captain Morgan Spiced' : 'img/captain1.png',
        'Captain Morgan White' : 'img/captain2.jpg',
        'Nevena Georgieva' : 'img/nevina.jpg',
        'Kavadarci Sour' : 'img/cherry.webp',
        'Whiskey Sour' : 'img/sour.jpg',
        'Blackberry Kiss' : 'img/blackberry.jpg',
        'All-You-Can-Eat Wings' : 'img/wine-wings.jpg',
        'Foks Promo' : 'img/wings.jpg',
        'Veda Promo' : 'img/wings2.jpg',
        'Kalesh Promo' : 'img/wings3.jpg',
        'Bak Pale Ale Promo' : 'img/wings4.webp',
        'Bak Stout Promo' : 'img/wings10.jpg',
        'Bak Pilsner Promo' : 'img/wings5.jpg',
        'Brewdog Punk IPA Promo' : 'img/wings6.jpg',
        'Brewdog Lost Lager Promo' : 'img/wings7.jpg',
        'Bevog Pale Ale Promo' : 'img/wings8.jpg',
        'Bevog Golden Ale Promo' : 'img/wings9.jpg'

    };

    // Function to fetch and display menu items
    function fetchAndDisplayMenuItems() {
        fetch('http://localhost:3000/menuitems')
            .then(response => response.json())
            .then(data => {
                const uniqueItems = removeDuplicates(data); // Remove duplicates
                const cardContainer = document.getElementById('card-container');
                cardContainer.innerHTML = ''; // Clear existing content

                uniqueItems.forEach(card => {
                    const imageUrl = imageUrlMap[card.name] || 'img/noimage.png'; // Use a default image if not found
                    const cardElement = document.createElement('div');
                    cardElement.className = 'col-12 col-sm-6 col-md-3 col-lg-3'; // Update to col-md-3 for 4 cards per row
                    cardElement.innerHTML = `
                        <div class="card-outside fade-in-top">
                            <div class="section-1" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center; height: 150px;"></div>
                            <div class="card-body text-center d-flex flex-column justify-content-between">
                                <div>
                                    <h5 class="card-title">${card.name}</h5>
                                    <p class="card-text">${card.description}</p>
                                </div>
                                <div class="d-flex align-items-center justify-content-center mt-auto">
                                    <button id="price-button" class="btn btn-outline-danger">${card.price} den</button>
                                    <button class="btn btn-outline-danger add-to-cart" data-id="${card.id}" data-name="${card.name}" data-description="${card.description}" data-price="${card.price}" data-img="${imageUrl}">Add to cart</button>
                                </div>
                            </div>
                        </div>
                    `;
                    cardContainer.appendChild(cardElement);
                });

                // Add event listeners for "Add to cart" buttons
                document.querySelectorAll('.add-to-cart').forEach(button => {
                    button.addEventListener('click', addToCart);
                });
            })
            .catch(error => console.error('Error fetching menu items:', error));
    }
    

    // Function to remove duplicates
    function removeDuplicates(items) {
        const seen = new Set();
        return items.filter(item => {
            const duplicate = seen.has(item.id);
            seen.add(item.id);
            return !duplicate;
        });
    }

    // Add item to cart
    function addToCart(event) {
        const button = event.target;
        const item = {
            id: button.getAttribute('data-id'),
            name: button.getAttribute('data-name'),
            description: button.getAttribute('data-description'),
            price: parseInt(button.getAttribute('data-price')),
            img: button.getAttribute('data-img'),
            quantity: 1
        };
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(item);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        showModal('Item has been added to your cart!', 'Go to cart to complete your order.');
    }

    // Function to show modal
    function showModal(title, message) {
        const modal = new bootstrap.Modal(document.getElementById('cartModal'));
        document.getElementById('cartModalTitle').textContent = title;
        document.getElementById('cartModalBody').textContent = message;
        modal.show();
    }

    // Initial fetch to load all items
    fetchAndDisplayMenuItems();

    // JWT Login functionality
    const loginForm = document.getElementById('login-form');

    function showNotification(message, type = 'success') {
        const notificationContainer = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.classList.add('alert', `alert-${type}`);
        notification.textContent = message;

        notificationContainer.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 500);
        }, 3000);
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.message || 'Failed to login');
            }

            const { token } = await response.json();
            sessionStorage.setItem('token', token);
            window.location.href = '/dashboard.html';
        } catch (error) {
            showNotification(error.message, 'danger');
        }
    });
    
});
