const form = document.forms['cart-add-form'];

var selectors = {
    firstName: form.firstname,
    lastName: form.lastname,
    address: form.address,
    phone: form.phone,
    saleType: form['sale-type'],
    cardType: form['card-type'],
    cardNumber: form['card-number'],
    cardExp: form['card-exp'],
    totalAmount: document.querySelector('#total-amount'),
    backToCart: document.querySelector('#backToCart'),
    placeOrder: document.querySelector('#placeOrder')
};


function saleTypeChange() {
    if (selectors.saleType.value === 'credit') {
        $('form .card').show();
        return;
    }
    $('form .card').hide();
}


function validFields() {
    const valid = true;

    const {
        firstName,
        lastName,
        address,
        phone,
        saleType,
        cardType,
        cardNumber,
        cardExp,
        backToCart,
        placeOrder
    } = selectors;
    const validFirstName = firstName.value !== '' && firstName.value.length <=20 && firstName.value.length >= 1
    const validLastName = lastName.value !== '' && lastName.value.length <=25 && lastName.value.length >= 1
    const validAddress = address.value !== '';
    const validPhone = phone.value !== '';
    let validPayment = true;
    
    if (saleType.value === 'credit' ){

        if(cardType.value === 'amex'){
            validPayment = cardNumber.value.length === 15;
        }
        else {
            validPayment = cardNumber.value.length === 16;
        }

        if (!validPayment) {
            cardNumber.required = true;
            cardNumber.invalid = true;
        } else {
            cardNumber.required = false;
            cardNumber.invalid = false;
        }
    }

    const validCardExp = saleType.value === 'credit' && cardExp.value != '';

    if (!validCardExp) {
        cardExp.required = true;
        cardExp.invalid = true;
    }
    else {
        cardExp.required = false;
        cardExp.invalid = false;
    }
    return validFirstName
        && validLastName
        && validAddress
        && validPhone
        && validPayment
        && validCardExp;
}

const placeOrder = () => {
    const validForm = validFields();

    if (!validForm) {
        form.classList.add('validate');
        return
    }
    form.classList.remove('validate');

    const {
        firstName,
        lastName,
        address,
        phone,
        saleType,
        cardType,
        cardNumber,
        cardExp,
        backToCart,
        placeOrder
    } = selectors;
    const ls = storageHelper();
    const cartData = ls.get('cart') || [];
    const data = {
        payment: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            phone: phone.value,
            saleType: saleType.value,
            cardType: cardType.value,
            cardNumber: cardNumber.value,
            cardExp: cardExp.value,
            total: calcTotal()
        },
        items: cartData.slice(0,)
    };
    fetch('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (res.ok) {
            return res.json()
        }
        return new Error(res)
    })
    .then(res => {
        //after placing order, empty the cart

        const ls = storageHelper();
        const cartData = ls.set('cart', []);
        $("#cart #count").text('0');

        console.log('Redirecting to orders');
        window.location.href = `/orders`;
    });
};

function calcTotal() {
    const ls = storageHelper();
    const cartData = ls.get('cart') || [];
    let totalAmount = 0;
    totalAmount = cartData.reduce((sum, item) => {
        return sum += item.price
    }, 0);
  
    cartData.forEach(i => {
      if (i.glossy) {
        totalAmount += 2 * i.quantity;
      }
    });

    selectors.totalAmount.innerText = totalAmount;
    return totalAmount;
}

window.addEventListener('DOMContentLoaded', () => {
    selectors.placeOrder.addEventListener('click', placeOrder);
    calcTotal()
});