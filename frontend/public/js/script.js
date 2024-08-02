// Variables
const STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};
let CUSTOMER_SERVICE_EMAIL;

// Socket IO
const socket = io();

// Main
const mainContainer = document.getElementById('main-container');
const loginContainer = document.getElementById('login-container');
const productMessageContainer = document.getElementById('product-message-container');
const IS_ADMIN = 1;
let ADMIN = false;

// Server
const URL = `http://localhost:8080`;

// Session
const formSignIn = document.getElementById('form-sign-in');
const formSignUp = document.getElementById('form-sign-up');
const divSignIn = document.getElementById('div-sign-in');
const divSignUp = document.getElementById('div-sign-up');
const divHeader = document.getElementById('div-header');
const divAuthError = document.getElementById('div-auth-error');
const divToggleAuth = document.getElementById('div-toggle-auth');
const authErrorTitle = document.getElementById('auth-error-title');
const btnSignIn = document.getElementById('btn-sign-in');
const btnSignUp = document.getElementById('btn-sign-up');
const btnToggleAuth = document.getElementById('btn-toggle-auth');
const btnSignOut = document.getElementById('btn-sign-out');
const btnGoToSignIn = document.getElementById('btn-go-to-sign-in');
const usernameOutput = document.getElementById('username-output');
const userAvatar = document.getElementById('user-avatar');
const passSignUp = document.getElementById('password-signup');
const confirmPassSignUp = document.getElementById('confirm-password-signup');

// Show products
const productTable = document.getElementById('product-table');
const productContainer = document.getElementById('product-container');
const cathegoryFilter = document.getElementById('cathegory-filter');

// Add product
const inputNameAdd = document.getElementById('name-add');
const inputPriceAdd = document.getElementById('price-add');
const inputImageAdd = document.getElementById('image-add');
const inputDescriptionAdd = document.getElementById('description-add');
const inputCathegoryAdd = document.getElementById('cathegory-add');
const inputStockAdd = document.getElementById('stock-add');
const buttonAddProduct = document.getElementById('button-add-product');
const buttonCancelFormAdd = document.getElementById('button-cancel-form-add');
const containerAddProduct = document.getElementById('container-add-product');
const formAddProduct = document.getElementById('form-add-product');

// Update product
const inputNameUpdate = document.getElementById('name-update');
const inputPriceUpdate = document.getElementById('price-update');
const inputImageUpdate = document.getElementById('image-update');
const inputDescriptionUpdate = document.getElementById('description-update');
const inputCathegoryUpdate = document.getElementById('cathegory-update');
const inputStockUpdate = document.getElementById('stock-update');
const buttonCancelFormUpdate = document.getElementById('button-cancel-form-update');
const containerUpdateProduct = document.getElementById('container-update-product');
const formUpdateProduct = document.getElementById('form-update-product');

// Shopping cart
let shoppingCartID = null;
let cart = [];
const cartList = document.getElementById('cart-list');
const totalPrice = document.getElementById('total');
const confirmCartProducts = document.getElementById('confirm-cart-products');
const btnTrigerModal = document.getElementById('button-trigger-modal');

// Message center
const messagesList = document.getElementById('messages-list');
const formMessage = document.getElementById('form-message');
const messageBody = document.getElementById('message-body');
const userEmail = document.getElementById('user-email-message');
const adminTargetMessage = document.getElementById('admin-target-message');

// Handlebars
let template;   // Template for card-images used for showing products. It's fetched from the server.

/* -------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------- PRODUCTS -------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------- */

// Event --> Add product
buttonAddProduct.addEventListener('click', () => {
    buttonAddProduct.classList.add('d-none');
    productContainer.classList.add('d-none');
    containerAddProduct.classList.remove('d-none');
});

buttonCancelFormAdd.addEventListener('click', () => {
    buttonAddProduct.classList.remove('d-none');
    productContainer.classList.remove('d-none');
    formAddProduct.reset();
    containerAddProduct.classList.add('d-none');
});

// Event --> Update product
buttonCancelFormUpdate.addEventListener('click', () => {
    containerUpdateProduct.classList.add('d-none');
    buttonAddProduct.classList.remove('d-none');
    formUpdateProduct.reset();
    productContainer.classList.remove('d-none');
});

// Event --> Filter by cathegory
cathegoryFilter.addEventListener('change', () => {
    if (cathegoryFilter.options[cathegoryFilter.selectedIndex].text === "All") { showProducts(); }
    else {
        showProductsFiltered(cathegoryFilter.value);
    }
});

// POST request to add new product to DB
formAddProduct.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        name: inputNameAdd.value,
        price: inputPriceAdd.value,
        image: inputImageAdd.value,
        description: inputDescriptionAdd.value,
        cathegory: {
            id: inputCathegoryAdd.value,
            name: inputCathegoryAdd.options[inputCathegoryAdd.selectedIndex].text
        },
        stock: inputStockAdd.value,
    };
    const dataJSON = JSON.stringify(data);
    const rawResponse = await fetch(`${URL}/api/productos`, {
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': dataJSON.length
        },
        method: 'POST',
        body: dataJSON
    });
    if (rawResponse.status === STATUS.CREATED) { showProducts(); showMainSite(); }
    else if (rawResponse.status === STATUS.UNAUTHORIZED) {
        buttonCancelFormAdd.click();
        (btnGoToSignIn.click());
        return;
    }
    else {
        let message = await rawResponse.text();
        window.alert(message);
    }
    formAddProduct.reset();
});

// POST request to update product from DB
formUpdateProduct.addEventListener('submit', async (e) => {
    e.preventDefault();
    let idProduct = document.getElementById('idProduct').value;
    const data = {
        name: inputNameUpdate.value,
        price: inputPriceUpdate.value,
        image: inputImageUpdate.value,
        description: inputDescriptionUpdate.value,
        cathegory: {
            id: inputCathegoryUpdate.value,
            name: inputCathegoryUpdate.options[inputCathegoryUpdate.selectedIndex].text
        },
        stock: inputStockUpdate.value,
    };
    const dataJSON = JSON.stringify(data);
    const rawResponse = await fetch(`${URL}/api/productos/${idProduct}`, {
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': dataJSON.length
        },
        method: 'PUT',
        body: dataJSON
    });
    if (rawResponse.status === STATUS.ACCEPTED) { showProducts(); showMainSite(); }
    else if (rawResponse.status === STATUS.UNAUTHORIZED) {
        buttonCancelFormUpdate.click();
        (btnGoToSignIn.click());
        return;
    }
    else {
        let message = await rawResponse.text();
        window.alert(message);
    }
    formUpdateProduct.reset();
});

// Get all products and list them
async function showProducts() {
    const rawResponse = await fetch(`${URL}/api/productos`);
    const products = await rawResponse.json();

    // Get cathegories from products and list them in add and update product
    const cathegories = [];
    inputCathegoryAdd.innerHTML = '';
    inputCathegoryUpdate.innerHTML = '';
    cathegoryFilter.innerHTML = `<option value="-1">All</option>`;
    products.forEach(p => {
        if (!cathegories.some(c => c.key === p.cathegory.id)) {
            cathegories.push({ key: p.cathegory.id, value: p.cathegory.name });
            inputCathegoryAdd.innerHTML += `<option value="${p.cathegory.id}">${p.cathegory.name}</option>`;
            inputCathegoryUpdate.innerHTML += `<option value="${p.cathegory.id}">${p.cathegory.name}</option>`;
            cathegoryFilter.innerHTML += `<option value="${p.cathegory.id}">${p.cathegory.name}</option>`;
        }
    });

    listProducts(products);
}

// Get product filtered by cathegory and list them
async function showProductsFiltered(filterValue) {
    const rawResponse = await fetch(`${URL}/api/productos/categoria/${filterValue}`);
    const products = await rawResponse.json();
    listProducts(products);
}

// Get all products and show them (with all of his properties)
async function listProducts(products) {
    const rawResponseHandlebards = await fetch(`${URL}/templates/card-images.hbs`);
    text = await rawResponseHandlebards.text();
    template = Handlebars.compile(text);

    // Prepare all product information and options
    if (products.length > 0) {
        // Prices with two decimals
        await products.forEach(p => p.price = parseFloat(p.price).toFixed(2));

        // Use Handelbars for products
        const html = await (products.map((product) => template({ ADMIN, ...product }))).join('');
        productTable.innerHTML = html;

        // Events for products
        products.forEach(p => {
            // Add delete and update products events only for admins
            if (ADMIN === IS_ADMIN) {
                // Delete product
                document.getElementById(`button-delete-product-id${p._id}`).addEventListener('click', async () => {
                    // Delete request to server and refresh website
                    const rawResponse = await fetch(`${URL}/api/productos/${p._id}`, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'DELETE'
                    });
                    if (rawResponse.status === STATUS.ACCEPTED) { showProducts(); }
                    else if (rawResponse.status === STATUS.UNAUTHORIZED) {
                        (btnGoToSignIn.click());
                        return;
                    }
                    else {
                        let message = await rawResponse.text();
                        window.alert(message);
                    }
                });

                // Update product
                document.getElementById(`button-update-product-id${p._id}`).addEventListener('click', () => {
                    // Show form
                    document.getElementById('idProduct').value = p._id;
                    buttonAddProduct.classList.add('d-none');
                    containerUpdateProduct.classList.remove('d-none');
                    productContainer.classList.add('d-none');
                });
            }

            // Add product to cart
            document.getElementById(`button-add-to-cart-id${p._id}`).addEventListener('click', async () => {
                // If cart doesn't exist, create it
                if (shoppingCartID === null) {
                    document.getElementById('cart-container').className = '';
                    const rawResponse = await fetch(`${URL}/api/carrito`, {
                        method: 'POST'
                    });
                    if (rawResponse.status === STATUS.UNAUTHORIZED) {
                        (btnGoToSignIn.click());
                        return;
                    }
                    const response = await rawResponse.json();
                    shoppingCartID = response._id;
                }

                // POST request to add product to cart
                const dataJSON = JSON.stringify(p);
                const rawResponse = await fetch(`${URL}/api/carrito/${shoppingCartID}/productos`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': dataJSON.length
                    },
                    method: 'POST',
                    body: dataJSON
                });
                if (rawResponse.status === STATUS.UNAUTHORIZED) {
                    (btnGoToSignIn.click());
                    return;
                }

                // Request return all products from cart
                const cartProducts = await rawResponse.json();
                btnTrigerModal.innerText = `Mostrat (${cartProducts.length})`;

                // Show all product from cart and update total value of purchase
                showCartProducts(cartProducts);
            });

        });
    }
};

/* -------------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------- SHOPING CARTS ------------------------------------------------ */
/* -------------------------------------------------------------------------------------------------------------- */

// Confirm cart products
confirmCartProducts.addEventListener('click', async () => {
    const rawResponse = await fetch(`${URL}/api/carrito/${shoppingCartID}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
    });
    if (rawResponse.status === STATUS.ACCEPTED) {
        // Reset shopping cart and show succed message
        cartList.innerHTML = '';
        totalPrice.value = 0;
        shoppingCartID = null;
        Swal.fire({
            text: 'Compra confirmada!',
            icon: 'success',
            confirmButtonText: 'Ok'
        });
        btnTrigerModal.innerText = `Mostrat (0)`;
    }
    else if (rawResponse.status === STATUS.UNAUTHORIZED) {
        (btnGoToSignIn.click());
        return;
    }
    else if (rawResponse.status === STATUS.BAD_REQUEST) {
        Swal.fire({
            text: 'El carrito está vacío.',
            icon: 'warning',
            confirmButtonText: 'Ok'
        });
    }
    else {
        Swal.fire({
            text: 'Ha ocurrido un error!',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
})

// Show all product from shopping cart
function showCartProducts(cartProducts) {
    let total = 0;
    cartList.innerHTML = '';
    totalPrice.value = 0;
    cartProducts.forEach(p => {
        total += (p.product.price * p.quantity);
        const li = document.createElement('li');
        li.innerHTML = `
            <h5>${p.product.name}</h5>
            <p>${p.product.description}<br>
            <b>$ ${p.product.price}</b><br>
            Cantidad: ${p.quantity}
            <button id="button-delete-from-cart-id${p.product._id}" type="button" class="btn btn-danger ms-2">Eliminar</button>
            </p>
        `;
        cartList.appendChild(li);

        // Delete product from cart
        document.getElementById(`button-delete-from-cart-id${p.product._id}`).addEventListener('click', async () => {
            // DELETE request to server
            const rawResponse = await fetch(`${URL}/api/carrito/${shoppingCartID}/productos/${p.product._id}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'DELETE'
            });
            if (rawResponse.status === STATUS.UNAUTHORIZED) {
                (btnGoToSignIn.click());
                return;
            }
            const updatedCart = await rawResponse.json();
            btnTrigerModal.innerText = `Mostrat (${updatedCart.length})`;
            showCartProducts(updatedCart);
        });
    });
    totalPrice.value = total.toFixed(2);
}

/* -------------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------- MESSAGE CENTER ----------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------- */
async function showMessages(user) {
    const rawResponse = await fetch(`${URL}/messages/${user}`);
    if (rawResponse.status === STATUS.OK) {
        const response = await rawResponse.json();
        messagesList.innerHTML = '';
        response.forEach(m => {
            showNewMessage(m);
        })
    }
}

function showNewMessage(message) {
    const li = document.createElement('li');
    let from;
    if (message.type === 'Customer Service') { from = message.type; }
    else { from = message.email; }
    li.innerHTML = `
        <b style="color:#6495ED"> ${message.timestamp}</b>
        <b style="color:#CD7F32"> ${from}</b>
        <i style="color:#00A36C">${message.body}</i>`;
    messagesList.appendChild(li);
}

formMessage.addEventListener('submit', (e) => {
    e.preventDefault();
    let type, email;
    if (ADMIN === IS_ADMIN) {
        type = 'system';
        email = adminTargetMessage.value;
    }
    else {
        type = 'user';
        email = userEmail.getAttribute('placeholder');
    }
    let message = {
        email: email,
        type: type,
        body: messageBody.value
    }
    socket.emit('send-message', message);
    messageBody.focus();
    messageBody.value = '';
})

/* -------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------- SOCKET IO -------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------- */
socket.on('welcome-message', async (message) => {
    messagesList.innerHTML = '';
    (ADMIN !== IS_ADMIN) && (showNewMessage(message));
});

socket.on('receive-message', async (message) => {
    showNewMessage(message);
});

/* -------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------- SESSION --------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------- */

// On loading website, first checks if user is logged in
window.addEventListener('load', async () => {
    const rawResponse = await fetch(`${URL}/usuarios/auth/me`);
    if (rawResponse.status === STATUS.ACCEPTED) {
        let response = await rawResponse.json();
        enterMainSite(response, socket.id);
    }
    else {
        btnGoToSignIn.click();
    }
});

// Sign-in
formSignIn.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = {
        email: formSignIn.elements.namedItem('email').value,
        password: formSignIn.elements.namedItem('password').value
    };
    const dataJSON = JSON.stringify(data);

    const rawResponse = await fetch(`${URL}/usuarios/sign-in`, {
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': dataJSON.length
        },
        method: 'POST',
        body: dataJSON
    });

    // Response
    if (rawResponse.status === STATUS.ACCEPTED) {
        let response = await rawResponse.json();
        await enterMainSite(response, socket.id);
    }
    else {
        let message = await rawResponse.text();
        showAuthError(message);
    }
    formSignIn.reset();
});

// Sign-up
formSignUp.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (passSignUp.value !== confirmPassSignUp.value) {
        showAuthError("Password don't match");
    }
    else {
        const data = new FormData(formSignUp);
        const rawResponse = await fetch(`${URL}/usuarios/sign-up`, {
            method: 'POST',
            body: data
        });

        // Response
        if (rawResponse.status === STATUS.ACCEPTED) {
            let response = await rawResponse.json();
            await enterMainSite(response, socket.id);
        }
        else {
            let message = await rawResponse.text();
            showAuthError(message);
        }
    }
    formSignUp.reset();
});

// Toggle sign-in sign-up
btnToggleAuth.addEventListener('click', () => {
    let text = btnToggleAuth.innerText;
    switch (text) {
        case 'Registrarse':
            divSignIn.classList.add('d-none');
            divSignUp.classList.remove('d-none');
            btnToggleAuth.innerText = 'Iniciar sesión';
            formSignIn.reset();
            break;
        default:
            divSignIn.classList.remove('d-none');
            divSignUp.classList.add('d-none');
            btnToggleAuth.innerText = 'Registrarse';
            formSignUp.reset();
            break;
    }
});

// Sign-out
btnSignOut.addEventListener('click', async () => {
    mainContainer.classList.add('d-none');
    loginContainer.classList.remove('d-none');
    divSignIn.classList.remove('d-none');
    divSignUp.classList.add('d-none');
    btnToggleAuth.innerText = 'Registrarse';
    await fetch(`${URL}/usuarios/sign-out`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
    });
    window.location.href = '/';
});

/* -------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------- UTILITIES -------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------- */

// Back to sign-in from error or ended session
btnGoToSignIn.addEventListener('click', () => {
    mainContainer.classList.add('d-none');
    loginContainer.classList.remove('d-none');
    divHeader.classList.add('d-none');
    divSignIn.classList.remove('d-none');
    divSignUp.classList.add('d-none');
    divToggleAuth.classList.remove('d-none');
    btnToggleAuth.innerText = 'Registrarse';
    divAuthError.classList.add('d-none');
    usernameOutput.innerText = '';
});

function showAuthError(message) {
    divAuthError.classList.remove('d-none');
    divSignIn.classList.add('d-none');
    divSignUp.classList.add('d-none');
    divToggleAuth.classList.add('d-none');
    authErrorTitle.innerText = message;
}

function showMainSite() {
    mainContainer.classList.remove('d-none');
    containerAddProduct.classList.add('d-none');
    containerUpdateProduct.classList.add('d-none');
    productContainer.classList.remove('d-none');
    loginContainer.classList.add('d-none');
    divHeader.classList.remove('d-none');
    if (ADMIN === IS_ADMIN) {
        buttonAddProduct.classList.remove('d-none');
        adminTargetMessage.disabled = false;
        adminTargetMessage.value = '';
    }
    else {
        buttonAddProduct.classList.add('d-none');
        adminTargetMessage.disabled = true;
        adminTargetMessage.setAttribute('placeholder', CUSTOMER_SERVICE_EMAIL);
    }
}

async function enterMainSite(userInfo, socketID) {
    // Set priviligies and info for user
    ADMIN = parseInt(userInfo.user.admin) || false;
    CUSTOMER_SERVICE_EMAIL = userInfo.CUSTOMER_SERVICE_EMAIL;
    userEmail.setAttribute('placeholder', userInfo.user.email);

    // Emit user info for socket management
    socket.emit('user-info', { socketID: socketID, email: userInfo.user.email });

    // Enter to main site
    showMainSite();
    showProducts();
    // await showMessages(userInfo.user.email);
    usernameOutput.innerText = `Bienvenid@ ${userInfo.user.name} !`;
    userAvatar.setAttribute('src', `${URL}` + userInfo.user.avatar);
}