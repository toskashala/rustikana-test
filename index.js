document.addEventListener('DOMContentLoaded', () => {
    // Function to animate count
    function animateCount(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.innerText = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Initialize Intersection Observer for the counter animation
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const countElements = entry.target.querySelectorAll('.count');
                countElements.forEach(el => {
                    const endValue = parseInt(el.getAttribute('data-target'), 10);
                    animateCount(el, 0, endValue, 2000); // 2000ms duration
                });
                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, {
        threshold: 0.5 // Adjust as needed
    });

    // Start observing the #row-bio section
    const rowBio = document.getElementById('row-bio');
    if (rowBio) {
        observer.observe(rowBio);
    }
    const fadeObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                fadeObserver.unobserve(entry.target); // Stop observing after the element is shown
            }
        });
    }, {
        threshold: 0.6 // Trigger when 10% of the element is visible
    });

    // Observe all elements with fade-in classes
    document.querySelectorAll('.fade-in-top, .fade-in-left, .fade-in-right, .fade-in-bottom').forEach(element => {
        fadeObserver.observe(element);
    });
});


document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0;
    const items = document.querySelectorAll('.slider-item');
    const totalItems = items.length;
    const visibleItems = 5; // Number of items visible at once
    let sliding = false;
    
    const cards = document.querySelectorAll('.card-outside');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${0.1 * index}s`;
        card.classList.add('fadeInUp');
    });

    function updateSlider() {
        const slider = document.querySelector('.slider');
        const itemWidth = items[0].clientWidth + 20; // 20 is the margin (10 + 10)
        const offset = -currentIndex * itemWidth; // Slide by one item width
        slider.style.transform = `translateX(${offset}px)`;
    }

    function moveRight() {
        if (sliding) return;
        sliding = true;

        const slider = document.querySelector('.slider');
        slider.style.transition = 'transform 0.2s ease';
        currentIndex = (currentIndex + 1) % totalItems;
        updateSlider();

        setTimeout(() => {
            slider.style.transition = 'none';
            const firstItem = slider.firstElementChild;
            slider.appendChild(firstItem);
            currentIndex--;
            updateSlider();
            sliding = false;
        }, 200);
    }

    function moveLeft() {
        if (sliding) return;
        sliding = true;

        const slider = document.querySelector('.slider');
        slider.style.transition = 'transform 0.2s ease';
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        const itemWidth = items[0].clientWidth + 20; // 20 is the margin (10 + 10)

        // Move the last item to the beginning
        slider.style.transition = 'none';
        const lastItem = slider.lastElementChild;
        slider.insertBefore(lastItem, slider.firstElementChild);

        // Correct the current index and apply the reverse transform
        currentIndex++;
        slider.style.transform = `translateX(${-itemWidth}px)`;

        // Allow the transition to occur
        setTimeout(() => {
            slider.style.transition = 'transform 0.2s ease';
            slider.style.transform = 'translateX(0px)';
            setTimeout(() => {
                sliding = false;
            }, 200);
        }, 20);
    }

    document.querySelector('.carousel-control-next').addEventListener('click', moveRight);
    document.querySelector('.carousel-control-prev').addEventListener('click', moveLeft);

    updateSlider();

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

    // Fetch menu items from the server
    fetch('/menuitems')
        .then(response => response.json())
        .then(data => {
            const uniqueItems = removeDuplicates(data); // Remove duplicates
            displayMenuItems(uniqueItems);
            document.querySelectorAll('.slider-item').forEach(item => {
                item.addEventListener('click', () => filterMenuItems(uniqueItems, item.querySelector('p').textContent));
            });
        })
        .catch(error => console.error('Error fetching menu items:', error));

    // Function to remove duplicates
    function removeDuplicates(items) {
        const seen = new Set();
        return items.filter(item => {
            const duplicate = seen.has(item.id);
            seen.add(item.id);
            return !duplicate;
        });
    }

    function displayMenuItems(menuItems) {
        const cardContainer = document.getElementById('card-container');
        cardContainer.innerHTML = '';
        menuItems.forEach(item => {
            const imageUrl = imageUrlMap[item.name] || 'img/noimage.png'; // Use a default image if not found
            const itemElement = document.createElement('div');
            itemElement.classList.add('col-sm-12', 'col-md-3', 'menu-item');
            itemElement.dataset.category = item.category.toUpperCase();
            itemElement.innerHTML = `
                <div class="card-outside">
                    <div class="section-1" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center; height: 150px;"></div>
                    <div class="card-body text-center d-flex flex-column justify-content-between">
                        <div>
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">${item.description}</p>
                        </div>
                        <div class="d-flex align-items-center justify-content-center mt-auto">
                            <button id="price-button" class="btn btn-outline-danger">${item.price} den</button>
                            <button class="btn btn-outline-danger add-to-cart" data-id="${item.id}" data-name="${item.name}" data-description="${item.description}" data-price="${item.price}" data-img="${imageUrl}">Add to cart</button>
                        </div>
                    </div>
                </div>
            `;
            cardContainer.appendChild(itemElement);
        });

        // Re-initialize the add-to-cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.dataset.id;
                const name = this.dataset.name;
                const description = this.dataset.description;
                const price = parseFloat(this.dataset.price);
                const img = this.dataset.img;

                let cart = JSON.parse(localStorage.getItem('cart')) || [];

                const existingItem = cart.find(item => item.id === id);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ id, name, description, price, img, quantity: 1 });
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                showModal('Item has been added to your cart!', 'Go to cart to complete your order.');
            });
        });
    }

    function filterMenuItems(menuItems, category) {
        const promoBanner = document.getElementById('promo-banner');
        if (category.toUpperCase() === 'ALL') {
            displayMenuItems(menuItems);
            promoBanner.classList.remove('show');
            promoBanner.classList.add('hide');
        } else {
            const filteredItems = menuItems.filter(item => item.category.toUpperCase() === category.toUpperCase());
            displayMenuItems(filteredItems);

            if (category.toUpperCase() === 'WINGS') {
                promoBanner.classList.remove('hide');
                promoBanner.classList.add('show');
            } else {
                promoBanner.classList.remove('show');
                promoBanner.classList.add('hide');
            }
        }
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
});

document.addEventListener("DOMContentLoaded", function () {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) { // Only close if on mobile
                navbarCollapse.classList.remove('show'); // Immediately hide the navbar
                navbarToggler.classList.add('collapsed'); // Set the toggler to collapsed state
            }
        });
    });
});
