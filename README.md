# Desafio clase 22

Consigna 1:

Se implementa una ruta GET '/api/products-test' la cual entrega una lista de 5 productos generados al azar utilizando la libreria Faker.js.

La lista de 5 productos junto a sus precios e imagenes se carga en una tabla al final de la landing page.

Consigna 2:

Se cambia el formato de mensajes del chat por:

{
  author: {
      email: 'mail del usuario',
      first_name: 'nombre del usuario',
      last_name: 'apellido del usuario',
      age: 'edad del usuario',
      alias: 'alias del usuario',
      avatar: 'url avatar (foto, logo) del usuario'
  },
  message: 'mensaje del usuario',
  date: new Date().toLocaleDateString(),
  time: new Date().toLocaleTimeString()
}

Se modifica la persistencia de los chats para que utilicen mongo atlas.

El mensaje se normaliza en el servidor utilizando Normalizr.

El front-end desnormaliza el array de chats y presenta la informacion.





