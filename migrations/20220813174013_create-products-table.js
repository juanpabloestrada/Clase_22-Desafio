const up = function(knex) {
  return knex.schema
  .createTable('products', table => {
    table.primary('id')
    table.increments('id')
    table.string('title', 30).nullable(false)
    table.float('price').nullable(false)
    table.string('thumbnail', 300)
  })
  .createTable('chats', table => {
    table.primary('id')
    table.increments('id')
    table.string('user', 20).nullable(false)
    table.string('message', 200)
    table.string('date', 20)
    table.string('time', 20)
  })
}

const down = function(knex) {
  return knex.schema.dropTableIfExists('products').dropTableIfExists('chats')
}

export { up, down }