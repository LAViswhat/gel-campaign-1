$(function() {

    function handleSending() {

        $('#address-form').submit(function(e) {
            e.preventDefault();

            let products = []
            let orderedProducts = $('.order-products')
            let orderedProduct = orderedProducts.find('.cart-product')

            orderedProduct.each(function(ind,el) {

            products.push(parseInt($(el).attr('data-id')))

            })

            let dataForm = {}

            if (!$("#select-another-address").is(':checked')) {
                dataForm = {
                    'email': $('#email_bil').val(),
                    'products': products,
                    'billing': {
                        'country_id': $('#select_country_bil').val(),
                        'state': $('#state_bil').val(),
                        'first_name': $('#firstname_bil').val(),
                        'last_name': $('#lastname_bil').val(),
                        'address_1': $('#address_bil').val(),
                        'address_2': $('#appartment_bil').val(),
                        'city': $('#city_bil').val(),
                        'zip': $('#postal_code_bil').val(),
                        'phone': $('#phone_bil').val(),
                        },
                    };
            } else {
                dataForm = {
                    'email': $('#email_bil').val(),
                    'products': products,
                    'billing': {
                        'country_id': $('#select_country_bil').val(),
                        'state': $('#state_bil').val(),
                        'first_name': $('#firstname_bil').val(),
                        'last_name': $('#lastname_bil').val(),
                        'address_1': $('#address_bil').val(),
                        'address_2': $('#appartment_bil').val(),
                        'city': $('#city_bil').val(),
                        'zip': $('#postal_code_bil').val(),
                        'phone': $('#phone_bil').val(),
                        },
                    'shipping': {
                        'country_id': $('#select_country_ship').val(),
                        'state': $('#state_ship').val(),
                        'first_name': $('#firstname_ship').val(),
                        'last_name': $('#lastname_ship').val(),
                        'address_1': $('#address_ship').val(),
                        'address_2': $('#appartment_ship').val(),
                        'city': $('#city_ship').val(),
                        'zip': $('#postal_code_ship').val(),
                        'phone': $('#phone_ship').val(),
                        },
                    };
            }

            $('.section-payments').show(300);
            $('#address-form button').text("Update address");
            console.log(dataForm);
            initialize(dataForm);
            checkStatus();
            scrollToPayment();

        });
    }
    handleSending()


});

const stripe = Stripe('pk_live_51NO339I0yrRWGOYT3GKzUve7r7h8q4GwFqNqutcYnWRggWMhQcvTOhXD6fsCpQje8e5RkKOcbuFnJWlrECEsFAHv00Hfj25OzK');

    // The items the customer wants to buy
    // let data = [];

    let elements;

    document
    .querySelector("#payment-form")
    .addEventListener("submit", handleSubmit);

    // Fetches a payment intent and captures the client secret
    async function initialize(data) {
        const { clientSecret } = await fetch("/en/stripe/create-indent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify( data ),
        }).then((r) => r.json());

        elements = stripe.elements({ clientSecret });

        const paymentElementOptions = {
            layout: "accordion",
            radios: false
        };

        const paymentElement = elements.create("payment", paymentElementOptions);
        paymentElement.mount("#payment-element");

    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
            return_url: "https://domocosmetics.shop/l/gel-campaign-3/successful_order.html",
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            showMessage(error.message);
        } else {
            showMessage("An unexpected error occurred.");
        }

        setLoading(false);
    }


    // Fetches the payment intent status after payment submission
    async function checkStatus() {
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

        switch (paymentIntent.status) {
            case "succeeded":
            showMessage("Payment succeeded!");
            break;
            case "processing":
            showMessage("Your payment is processing.");
            break;
            case "requires_payment_method":
            showMessage("Your payment was not successful, please try again.");
            break;
            default:
            showMessage("Something went wrong.");
            break;
        }
    }

    // ------- UI helpers -------

    function showMessage(messageText) {
        const messageContainer = document.querySelector("#payment-message");

        messageContainer.classList.remove("hidden");
        messageContainer.textContent = messageText;

        setTimeout(function () {
            messageContainer.classList.add("hidden");
            messageContainer.textContent = "";
        }, 4000);
    }

    // Show a spinner on payment submission
    function setLoading(isLoading) {
        if (isLoading) {
            // Disable the button and show a spinner
            document.querySelector("#submit").disabled = true;
            document.querySelector("#spinner").classList.remove("hidden");
            document.querySelector("#button-text").classList.add("hidden");
        } else {
            document.querySelector("#submit").disabled = false;
            document.querySelector("#spinner").classList.add("hidden");
            document.querySelector("#button-text").classList.remove("hidden");
        }
    }

    // Scroll to payement section
    function scrollToPayment () {
        let stickyHeaderHeight = $('.sticky-header').outerHeight();
            $('html, body').animate({
                scrollTop: $( $(".section-payments") ).offset().top - stickyHeaderHeight + 20 + 'px'
            }, 500);
    }
