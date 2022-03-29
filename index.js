const express = require("express")
const uuid = require(`uuid`)

const port = 3000
const app = express()

app.use(express.json())

/*
    - Query Params => meusite.com/users?nome=talles&age=32  // Filtros

    - Route Params => users/2  // Buscar, Deletar ou Atualizar algo específico

    - Request Body => {"nome": "Talles", "age":}

    - GET          => Buscar informação no back-end
    - POST         => Criar informação no back-end
    - PUT / PATCH  => Alterar / Atualizar informação no back-end
    - DELETE       => Deletar informação no back-end

    - Middlewares  => INTERCEPTADOR => Tem o poder de para ou alterar dados da requisição
*/

const users = []

const checkUserId = (request, response, next) => {

    //Atualização de usuário
    const { id } = request.params

    //Encontrando usuário dentro do array e retornando posição
    const index = users.findIndex(user => user.id === id)

    //Caso usuário não seja encontrado retorna a message
    if (index < 0) {
        return response.status(404).json({ error: "User not found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}

app.get(`/users`, (request, response) => {
    return response.json(users)
})

app.post(`/users`, (request, response) => {
    const { name, age } = request.body

    const user = { id: uuid.v4(), name, age }

    users.push(user)

    return response.status(201).json(user)
})

app.put(`/users/:id`, checkUserId, (request, response) => {

    //Informações que serão atualizadas : name, age
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    //Criando usuário
    const updateUser = { id, name, age }

    //Vai até a posição que o usuário está e atualiza as informações dele
    users[index] = updateUser

    return response.json(updateUser)
})

app.delete(`/users/:id`, checkUserId, (request, response) => {
   
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()
})

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})

/*
app.get("/users/:id", (request, response) => {

    const name = request.query.name
    const age = request.query.age
    return response.json({name: name, age: age})
    
    const { name, age } = request.query
    return response.json({name, age})

    const { id } = request.params
    return response.json({id})

    const { name, age } = request.body

    return response.json({ name, age})
    
})
*/