const socket = io({
  autoConnect:false
});

/* Form para agregar un nuevo producto a la base de datos */

const productForm = document.getElementById('productForm');

productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);
  fetch('/api', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(res => {
    if (res.status === 'success') {
      Swal.fire({
        icon: 'success',
        text: "Product added successfully",
        toast: true,
        position: "top-right",
        timer: 2000
      });
    }
    if (res.status === 'error') {
      Swal.fire({
        icon: 'error',
        text: "Failed to add product",
        toast: true,
        position: "top-right",
        timer: 2000
      })
    }
  })
});

/* Listener del socket para actualizar lista de productos */

/* Orden de hacer fetch de productos */
socket.on('fetchProducts', () => {
  fetch('http://localhost:8080/api', {
    method: 'GET'
  })
  .then(res => res.json())
  .then(products => {
    const productTemplate = document.querySelector('#productListTemplate').innerHTML;
    const compiledProductTemplate = Handlebars.compile(productTemplate);
    document.querySelector('#productListContainer').innerHTML = compiledProductTemplate(products);
  });
});

/* Informacion de que otro usuario ha agregado un nuevo producto */
socket.on('newProduct', () => {
  Swal.fire({
    icon: 'info',
    text: 'New product has been added',
    toast: true,
    position: "top-right",
    timer: 2000
  });
})

/* Listeners del socket para el chat */

let email;
let firstName;
let lastName;
let age;
let alias;
let avatarURL;

Swal.fire({
  title: "Identifícate",
  html:
    '<label for="email" class="form-label">email:</label><input id="email" type="email" class="form-control"><br>' +
    '<label for="firstName" class="form-label">First Name:</label><input id="firstName" type="text" class="form-control"><br>' +
    '<label for="lastName" class="form-label">Last Name:</label><input id="lastName" type="text" class="form-control"><br>' +
    '<label for="age" class="form-label">Age:</label><input id="age" type="number" class="form-control"><br>' +
    '<label for="alias" class="form-label">Alias:</label><input id="alias" type="text" class="form-control"><br>' +
    '<label for="avatar" class="form-label">Avatar URL:</label><input id="avatar" type="text" class="form-control" value="https://gravatar.com/avatar/2b021b60a89c2fedb29d421bdc5acd61?s=200&d=robohash&r=x"><br>',
  confirmButtonText: 'Submit',
  focusConfirm: false,
  preConfirm: () => {
    const I1 = Swal.getPopup().querySelector('#email').value
    const I2 = Swal.getPopup().querySelector('#firstName').value
    const I3 = Swal.getPopup().querySelector('#lastName').value
    const I4 = Swal.getPopup().querySelector('#age').value
    const I5 = Swal.getPopup().querySelector('#alias').value
    const I6 = Swal.getPopup().querySelector('#avatar').value
    if (!I1 || !I2 || !I3 || !I4 || !I5 || !I6) {
      Swal.showValidationMessage("¡Necesitas completar todos los campos para poder continuar!")
    }
    return { email: I1, firstName: I2, lastName: I3, age: I4, alias: I5 , avatarURL: I6}
  },
  allowOutsideClick: false,
  allowEscapeKey: false
})
.then((result) => {
  email = result.value.email
  firstName = result.value.firstName
  lastName = result.value.lastName
  age = result.value.age
  alias = result.value.alias
  avatarURL = result.value.avatarURL
  socket.connect();
});

/* Informacion de que un nuevo usuario esta en linea */
socket.on('newUser', (userId) => {
  if (email) {
    Swal.fire({
      text: 'User ' + userId + ' is online',
      toast: true,
      position: "top-right",
      timer: 2000
    });
  }
});

const chatBox = document.getElementById('chatBox');


function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
}


/* Event Listeners del chatBox */
chatBox.addEventListener('keyup',evt => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit('message', {
        author: {
            email: email,
            first_name: firstName,
            last_name: lastName,
            age: age,
            alias: alias,
            avatar: avatarURL
        },
        message: chatBox.value,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      });
      chatBox.value = '';
    }
  }
});

/*Listeners del socket */
socket.on('log', (data) => {
  const author = new normalizr.schema.Entity('authors', {}, {idAttribute: "email"})
  const message = new normalizr.schema.Entity('messages', {
    author: author
  }, {idAttribute: "_id"})
  const chat = new normalizr.schema.Entity('chats', {
    chats: [message]
  })
  const denormalizedData = normalizr.denormalize(data.result, chat, data.entities)
  const chatsArray = denormalizedData.chats
  let log = document.getElementById('log');
  let messages = "";
  chatsArray?.forEach(entry => {
    const message = entry._doc
    const author = message.author
    const messageToAdd = (email === author.email)
    ? `<div class="border border-1 rounded border-primary bg-primary m-1 p-2 align-self-end" style="width: 200px;"><span><img style="border-radius: 50%; width: 30px; height: 30px; object-fit: contain; background-color: white" src='${author.avatar}' alt='user avatar'></span><br><span style="width: 200px;"><b>${author.alias}:</b> <i>${message.message}</i><br><small style="color: brown;">${message.date}</small><br><small style="color: brown;">${message.time}</small></span></div>`
    : `<div class="border border-1 rounded border-success bg-success m-1 p-2 align-self-start" style="width: 200px;"><span><img style="border-radius: 50%; width: 30px; height: 30px; object-fit: contain; background-color: white" src='${author.avatar}' alt='user avatar'></span><br><span style="width: 200px;"><b>${author.alias}:</b> <i>${message.message}</i><br><small style="color: brown;">${message.date}</small><br><small style="color: brown;">${message.time}</small></span></div>`;
    messages += messageToAdd;
  });
  log.innerHTML = messages;
})


/* Tabla de productos aleatorios utilizando Faker.js (Desafio clase 22) */
let table = document.querySelector('.faker')
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/products-test')
  .then(res => res.json())
  .then(products => {
    let rows = `<tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>image</th>
                </tr>`
    products.forEach(product => {
      let row = `<tr>
                  <td>${product.title}</td>
                  <td>$ ${product.price}</td>
                  <td><img style="width: 200px;" src='${product.image}'></td>
                </tr>`
      rows += row
    })
    table.innerHTML = rows
  })
})




