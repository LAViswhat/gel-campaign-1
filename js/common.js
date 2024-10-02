/* ===========> Scripts Firing <=========== */
window.addEventListener( "load", function () {
    lav_preloader();
    lav_custom_animation();
    lav_anchor();
    lav_sticky_header ();
    lav_toogle_cart();
    lav_add_to_cart();
    lav_remove_product();
    lav_open_checkout ();
    lav_languages();
    lav_button_up();
    lav_sticky_button();
    lav_change_label_size();
    lav_add_shipping_address ();
    lav_get_utm();
});

jQuery(window).on( 'orientationchange', function () {
    lav_force_show_animated();
});

let cart = []

let clickCounter = 1;

/* ===========> Scripts Helpers <=========== */
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

/* ===========> Scripts Declaration <=========== */

function lav_preloader() {
    setTimeout(function(){
        $('.lav-preloader').addClass('hidden');
    }, 500);
}

function lav_custom_animation() {
    setTimeout(function(){
        let animatedColumns = [];
        let checkScroll = 0;
        let windowHeight = jQuery(window).height();

        jQuery('.lav-animation').each(function(i, el){
            let module_offset = jQuery(el).offset().top;
            let module_show = windowHeight - jQuery(el).innerHeight() / 4;
            let delay = jQuery(el).data('delay');
            let elHeight = jQuery(el).height();

            if( elHeight > windowHeight * 2 ){
                module_show = windowHeight - jQuery(el).innerHeight() / 4;
            }
            
            animatedColumns[i] = [ jQuery(el), module_show, module_offset ];

            if( jQuery(window).scrollTop() + module_show >= module_offset ) {
                if( typeof delay != 'undefined' ) {
                    setTimeout(function(){
                        jQuery(el).addClass('loaded');
                    }, delay);
                } else {
                    jQuery(el).addClass('loaded');
                }
            }
        });

        jQuery(window).on('scroll', function(){
            let currentScroll = jQuery(this).scrollTop();
            if( currentScroll > checkScroll + 100 ){

                jQuery(animatedColumns).each(function(i, el){
                    let delay = jQuery(el[0]).data('delay');
                    if( currentScroll + el[1] >= el[2] ){

                        if( typeof delay != 'undefined' ) {
                            setTimeout(function(){
                                el[0].addClass('loaded');
                            }, delay);
                        } else {
                            el[0].addClass('loaded');
                        }
                    }
                });
                
                checkScroll = currentScroll;
            }
        });
    }, 500);
}

function lav_force_show_animated() {
    jQuery('.lav-animation').each(function(i, el){
        jQuery(el).addClass('loaded')
    });
}

function lav_anchor() {
    $(document).on('click', 'a[href^="#"]', function (e) {
        e.preventDefault();

        // Check sticky header height
        let stickyHeaderHeight = jQuery('.sticky-header').outerHeight();
        

        // Anchor scroll
        jQuery('html, body').animate({
            scrollTop: jQuery( jQuery.attr(this, 'href') ).offset().top - stickyHeaderHeight + 20 + 'px'
        }, 500);

        $('.cart-content').removeClass('active')

    });
}

function lav_sticky_header () {
    let currentScroll = $(window).scrollTop();

    // Sticky menu appearance script
    stickyHeader = $('.sticky-header');
    let stickyHeaderHeight = stickyHeader.outerHeight();

    stickyHeader.css('top', '-' + stickyHeaderHeight + 'px');

    // Show sticky on load
    if( currentScroll > stickyHeaderHeight + 500 ){
        stickyHeader.addClass('is-visible');
    }

    // Show sticky on scroll
    $(window).on('scroll', function(){
        let currentScroll = $(this).scrollTop();

        if( currentScroll > stickyHeaderHeight + 500 ){
            stickyHeader.addClass('is-visible');
        } else {
            stickyHeader.removeClass('is-visible');

            stickyHeader.find('.cart-content').removeClass('active');
            /* stickyHeader.find('.r1-dropdown-languages').slideUp(); */
        }
    });
}

function lav_toogle_cart() {
    jQuery('.cart-image').on('click', function() {
        jQuery(this).next().toggleClass('active');
    });

    jQuery('.cart-empty .cart-button').on('click', function() {
        jQuery('.cart-content').removeClass('active');
    });
}


function lav_render_cart() {
    $('.cart-products').empty();
    cart.forEach((product) => $('.cart-products').prepend(product.output))
}

function lav_add_to_cart() {
    $('.product-btn').off();

    $('.product-btn').on('click', function() {
        
        let button = $(this);

        // Get current product object
        let product = button.closest('.product-item');

        // Get required product attributes
        let productId = product.attr('data-id')
        let productImg = product.find('.product-item-image').html();
        let productTitle = product.find('.product-item-title').text();
        let productQty = product.find('.product-item-qty').text();
        let productPrice = product.find('.product-current-price span').text();
        
        // Forming HTML
        let output = "<div class='cart-product' data-price='"+productPrice+"' data-id='"+productId+"'><div class='row align-items-center'><div class='col-2 d-flex justify-content-center px-0'><div class='product-img'>"+productImg+"</div></div><div class='col-10 d-flex justify-content-between'><div class='product-content'><h4>"+productTitle+"</h4><h5>"+productQty+"</h5></div><div class='product-price d-flex align-items-start'><p>"+productPrice+" €</p></div><div class='product-remove d-flex justify-content-center align-items-center'><span></span></div></div></div></div>"
        

        // Add product in array cart
        let selectedProduct = {
            output: output,
            id: productId
        }
        cart.push(selectedProduct)

        // Rendering product in cart
        lav_render_cart()

      /*   $('.cart-products').prepend(output); */
        
        // Change products count
        let count = parseInt( $('.section-hero .cart .cart-image .count').text());
        $('.cart .cart-image .count').text(count + 1);

        // Change ADD button
        button.text('ADDED').addClass('active');

        setTimeout(function(){
            button.text('ADD TO CART').removeClass('active');
        }, 1000);

        // Open cart content
        $('.cart-content').addClass('active')

        // Recalculate price
        let currentPrice = $('.section-hero .cart .cart-summery > h4 > span').text();
        $('.cart .cart-summery > h4 > span').text((parseFloat(currentPrice)+parseFloat(productPrice)).toFixed(2));

        // Reinit remove product script
        lav_remove_product();
    })
}

function lav_remove_product() {
    $('.product-remove').off();
    $('.product-remove').on('click', function() {

        // Remove products form cart
        let prodId = cart.find(product => product.id == $(this).closest('.cart-product').attr('data-id') )
        cart.splice(cart.indexOf(prodId), 1)

        // Rerendering cart products
        lav_render_cart()
        
        // Change product count
        let count = parseInt( $('.section-hero .cart .cart-image .count').text() );
        $('.cart .cart-image .count').text(count - 1);

        // Recalculate price
        let productPrice = $(this).closest('.cart-product').attr('data-price');
        let currentPrice = parseFloat(jQuery('.section-hero .cart .cart-summery > h4 > span').text()).toFixed(2);

        $('.cart .cart-summery > h4 > span').text((parseFloat(currentPrice)-parseFloat(productPrice)).toFixed(2));

        // Close checkout section 
        if ($('.cart-products').children().length === 0) {
            $('.section-checkout').removeClass('active')
        }

        // Reinit remove product script
        lav_remove_product();

    });
}


function lav_open_checkout () {
    $('.cart-btn.checkout').off();

    $('.cart-btn.checkout').on('click', function() {
        let button =$(this);

        // Open checkout section
        $('.section-checkout').addClass('active')

        // Forming order summery
        $('.order-products').children().remove();
        $('.order-summery').children().remove();

        button.siblings('.cart-products').children().clone().appendTo('.order-products')
        button.siblings('.cart-summery').children().clone().appendTo('.order-summery')

        // Close payment section if it's opened
        if ($('.section-payments').css('display', 'block')) {
            $('.section-payments').css('display', 'none')
        }

        // Change button text from "Update address" to "Proceed to payment"
        $('#address-form button').text("Proceed to payment");
    })
}

function lav_button_up() {
    jQuery(window).on('scroll', function() {
        if( jQuery(this).scrollTop() > 800 ){
            jQuery('.lav-button-up').addClass('active');
        } else {
            jQuery('.lav-button-up').removeClass('active');
        }
    });

    jQuery('.lav-button-up').on('click', function() {
        jQuery('body,html').animate({'scrollTop':0}, 500);
    });
}

function lav_languages() {
    jQuery('.lav-current-language').on('click', function() {
        jQuery(this).next().slideToggle();
    });
}

function lav_sticky_button() {
    let currentScroll = jQuery(window).scrollTop();

    // Sticky button appearance script
    stickyButton = jQuery('.lav-sticky-button .primary-btn');
    let stickyButtonHeight = stickyButton.outerHeight();

    stickyButton.css('bottom', '-' + stickyButtonHeight + 'px');

    // Show sticky on load
    if( currentScroll > stickyButtonHeight + 800 ){
        stickyButton.addClass('is-visible');
    }

    // Show sticky on scroll
    jQuery(window).on('scroll', function(){
        let currentScroll = jQuery(this).scrollTop();

        if( currentScroll > stickyButtonHeight + 800 ){
            stickyButton.addClass('is-visible');
        } else {
            stickyButton.removeClass('is-visible');
        }
    });
}

function lav_change_label_size () {
    $('.form-control').off();

    $('.form-control').on('focus', function() {
        jQuery(this).parent().addClass('active');
    });

    $('.form-control').on('focusout', function() {
        if( !jQuery(this).val() ){
            jQuery(this).parent().removeClass('active');
        }
    });
}

function lav_add_shipping_address () {
    if ($('.select-another-address').length)
    {
        let form = $('.container__ship')
        inputs = $('.container__ship div').children()

        if ($("#select-another-address").is(':checked')) {
            form.show();
            inputs.prop('required', true);
        }

        $('#select-another-address').on('click', function ()
        {
            if (!$(this).is(':checked')) {
                form.slideUp(200)
                inputs.removeAttr('required')

                $(this).parent().css("color", "#8a8a8a")

            } else {
                form.slideDown(500)
                inputs.not("#appartment_ship").prop('required', true)
                
                $(this).parent().css("color", "#000")
                $('html, body').animate({
                    scrollTop: form.offset().top
                }, 300);
            }
        });
    }
}

function lav_get_utm() {
    let paramsUTM = window.location.search.substring(1);
    let UTCDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toUTCString();
    if (paramsUTM) {
        document.cookie = `utm =${JSON.stringify(decodeURI(paramsUTM))}; expires=${UTCDate}`;
    }
}


