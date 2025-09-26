$(document).ready(function() {
    let cart = [];
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    const trackingModal = new bootstrap.Modal(document.getElementById('trackingModal'));

    // --- Original Effects (Rewritten in jQuery) ---

    // Smooth scrolling for navigation links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $(this.hash).offset().top
        }, 800);
    });

    // Header scroll effect
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 50) {
            $('#header').addClass('bg-white shadow-md');
        } else {
            $('#header').removeClass('bg-white shadow-md');
        }
    });

    // --- New Functionality ---

    // 1. Add to Cart Logic
    $('.add-to-cart-btn').on('click', function() {
        const card = $(this).closest('.menu-card');
        const itemName = card.data('name');
        const itemPrice = parseFloat(card.data('price'));

        const existingItem = cart.find(item => item.name === itemName);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name: itemName, price: itemPrice, quantity: 1 });
        }
        
        updateCart();
    });

    // 2. Update Cart Display
    function updateCart() {
        const cartItemsContainer = $('#cart-items-container');
        const cartTotalEl = $('#cart-total');
        const cartCountEl = $('#cart-count');
        
        cartItemsContainer.empty();
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.html('<p class="text-center">Your cart is empty.</p>');
            $('#checkout-btn').prop('disabled', true);
        } else {
            $('#checkout-btn').prop('disabled', false);
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                totalItems += item.quantity;

                const itemHTML = `
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">Price: ₹${item.price}</small>
                        </div>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary quantity-change" data-index="${index}" data-action="decrease">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary quantity-change" data-index="${index}" data-action="increase">+</button>
                            <button class="btn btn-sm btn-danger ms-3 remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
                        </div>
                        <span class="fw-bold">₹${itemTotal.toFixed(2)}</span>
                    </div>`;
                cartItemsContainer.append(itemHTML);
            });
        }
        
        cartTotalEl.text(`₹${total.toFixed(2)}`);
        cartCountEl.text(totalItems);
        cartCountEl.css('display', totalItems > 0 ? 'block' : 'none');
    }

    // Open cart modal
    $('#cart-button').on('click', () => cartModal.show());
    
    // Handle quantity changes and item removal in cart
    $('#cart-items-container').on('click', '.quantity-change', function() {
        const index = $(this).data('index');
        const action = $(this).data('action');

        if (action === 'increase') {
            cart[index].quantity++;
        } else if (action === 'decrease') {
            cart[index].quantity--;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        }
        updateCart();
    });

    $('#cart-items-container').on('click', '.remove-item', function() {
        const index = $(this).data('index');
        cart.splice(index, 1);
        updateCart();
    });

    // 3. Search and Filter Logic
    function performFilter() {
        const searchTerm = $('#search-bar').val().toLowerCase();
        const activeFilter = $('.btn-filter.active').data('filter');

        $('.menu-card').each(function() {
            const name = $(this).data('name').toLowerCase();
            const category = $(this).data('category');

            const matchesSearch = name.includes(searchTerm);
            const matchesFilter = activeFilter === 'all' || category === activeFilter;

            if (matchesSearch && matchesFilter) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    $('#search-bar').on('keyup', performFilter);

    $('.btn-filter').on('click', function() {
        $('.btn-filter').removeClass('active');
        $(this).addClass('active');
        performFilter();
    });

    // 4. Checkout and Order Tracking Simulation
    $('#checkout-btn').on('click', function() {
        if(cart.length > 0) {
            cartModal.hide();
            trackingModal.show();
            simulateOrderTracking();
            
            // Clear cart after checkout
            cart = [];
            updateCart();
        }
    });

    function simulateOrderTracking() {
        const statuses = $('.tracking-status');
        statuses.removeClass('active');
        statuses.find('i').removeClass('fa-check-circle').addClass('fa-spinner fa-spin');
        
        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < statuses.length) {
                const currentStatus = $(statuses[currentStep]);
                currentStatus.addClass('active');
                currentStatus.find('i').removeClass('fa-spinner fa-spin').addClass('fa-check-circle');
                currentStep++;
            } else {
                clearInterval(interval);
            }
        }, 1500); // 1.5 second delay between steps
    }

    // Initial cart update
    updateCart();
});