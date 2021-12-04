
var utils = {
    imgSelect: (e) => {
        const img = e.target.id;
        // fetch(`/getImage/img?img="${img}"`,{
        //     method: 'POST',
        //     data: {
        //         img,
        //     }
        // })
        //     .then(res => {
        //         if (res.ok){
        //             return res.json()
        //         }
        //         return new Error(res)
        //     })
        //     .then(res => {
        //         console.log("server response", res)
        //         window.selectedImahe = res.img
        //     })

        const imgSrc = e.target.src;

        if (imgSrc) {
            $('#selectedImg').attr('src', imgSrc);
            openModal();
        }
    }
}

window.cartCount = 0
window.addEventListener('cart_add', (data) => {
    cartCount += data.quantity
});

var openModal = () => {
    $('#addToCartModal').modal('show');
}

var closeModal = () => {
    $('#addToCartModal').modal('hide'); 
}

const form = document.forms['cart-add-form'];
var selectors = {
    images: document.querySelectorAll('.image-carousel img'),
    modalCloseBtn: document.querySelector('.btn-close'),
    formControl: {
        quality: document.querySelector('#quality-select'),
        type: form.type,
        glossy: form.glossy,
        quantity: document.querySelector('#quantity'),
        cost: document.querySelector("#cost"),
        estimatedDelivery: document.querySelector('#estimatedDelivery'),
        calculate: document.querySelector('#calculate'),
        addToCart: document.querySelector('#addToCart'),
    }
}



function calculateCost() {
    const qualityField = selectors.formControl.quality.value;
    const typeField = selectors.formControl.type.value;

    const quantity = parseInt(selectors.formControl.quantity.value || 1, 10);

    const type = pricingConfig[typeField];

    const priceConfig = type.find(item => item.quality == qualityField);

    return priceConfig.price * quantity;
}

function showPrice() {
    const cost = calculateCost();

    const priceDisplay = document.querySelector('#cost');
    priceDisplay.value = cost;

    calculateDelivery();
}

function calculateDelivery () {
    const estimatedDelivery = {
        'hard-copy': 1,
        poster: 1,
        mug: 2,
        tshirt: 3
    };

    const typeField = selectors.formControl.type.value;

    const deliveryDate = estimatedDelivery[typeField];
    
    const currentDate = new Date();
    const d = currentDate.getDate() + estimatedDelivery[typeField];
    const m = currentDate.getMonth();
    const y = currentDate.getYear();
    

    const expectedDate =  `${m}/${d}/${y}`;
    const message =  `Estimated Delivery: Your Delivery will be ready on ${expectedDate}`;

    selectors.formControl.estimatedDelivery.innerText = message || '';
}

function showQuantityError() {
    const err = document.querySelector('.quantity-err');
    err.style.display = 'block';
}


function isValidFields(){
    const quantity = parseInt(selectors.formControl.quantity.value, 10);
    if (quantity && quantity > 0 && quantity <= 10) {
        const err = document.querySelector('.quantity-err');
        err.style.display = 'none';
        return true
    }

    else { 
        showQuantityError()
    }
}

function storageHelper() {
    const storage = window.localStorage;

    return {
        get: (key) => {
            const data = storage.getItem(key);
            if (data) {
                return JSON.parse(data)
            }
        },
        set: (key, data) => {
            storage.setItem(key, JSON.stringify(data))

            //update cart count
        }
    }
}


function cartIdGenerator() {
    const ls = storageHelper();
    const data = ls.get('cart');
    const initID = 1110;
    if (data && data.cart && data.cart.length){
        data.cart.reduce((max, current) => {
            return max = current.cartID > max
        },initID )
    }
    return initID;
}

function showSuccessNotification() {
    $('.alert.alert-success').fadeIn(3000, ()=> {
        $('.alert.alert-success').fadeOut(4000)
    })
}

function onAddToCart() {
    const entries = {
        selectedImg:  $('#selectedImg').attr('src'),
        quality: selectors.formControl.quality.value,
        quantity: parseInt(selectors.formControl.quantity.value, 10),
        type: selectors.formControl.type.value,
        glossy: selectors.formControl.glossy.checked,
        price: calculateCost(),
        cartID: cartIdGenerator()
    };

    const ls = storageHelper();
    const currentCart = ls.get('cart');
    const newCart = [];

    if (currentCart){
        const similarItemAlreadyExists = currentCart.find(item => {
            return item.selectedImg === entries.selectedImg
            && item.quality === entries.quality
            && item.type === entries.type
            && item.glossy == entries.glossy
        })

        // check if similar configurations previously added, then update the quantity
        // else add as a new item

        if (similarItemAlreadyExists) {
            similarItemAlreadyExists.quantity += parseInt(entries.quantity, 10);

            currentCart.forEach(item => newCart.push(item))
        }
        else {
            currentCart.forEach(item => newCart.push(item))
            newCart.push(entries)
        }
        
    } else {
        newCart.push(entries)
    }

    const cartCount = newCart.reduce((sum, curr) => sum+curr.quantity, 0);

    ls.set('cart', newCart);
    showSuccessNotification()
    updateCartCount(cartCount);
}

function updateCartCount(cartCount) {
    const event = new CustomEvent('UpdateCartCount', { detail: cartCount });
    document.dispatchEvent(event);
}

function readExistingItemsInCart() {
    const ls = storageHelper();
    const currentCart = ls.get('cart') || [];
    const cartCount = currentCart.reduce((sum, curr) => sum+curr.quantity, 0);

    updateCartCount(cartCount)
}

function cartCountUpdate(data) {
    document.querySelector('#count').innerText = data.detail;
}

document.addEventListener('DOMContentLoaded', () => {
    selectors.images.forEach(img => {
        img.addEventListener('click', utils.imgSelect)
    })

    selectors.modalCloseBtn.addEventListener('click', closeModal);

    document.addEventListener('UpdateCartCount', cartCountUpdate, false);

    readExistingItemsInCart();
})
