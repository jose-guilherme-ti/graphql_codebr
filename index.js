const { ApolloServer, gql } = require('apollo-server')

const usuarios = [{
    id: 1,
    nome: 'João Silva',
    email: 'jsilva@gmail.com',
    idade: 29,
    perfil_id: 1
},
{
    id: 2,
    nome: 'Rafael Junior',
    email: 'rafajun@gmail.com',
    idade: 31,
    perfil_id: 2
},
{
    id: 3,
    nome: 'Daniela Smith',
    email: 'danismi@gmail.com',
    idade: 24,
    perfil_id: 1
}
]


const perfis  =[{
    id: 1,
    nome: 'Comum',
},
{
    id: 2,
    nome: 'Administrador',
}
]


const typeDefs = gql`
    scalar Date

    type Usuario{
        id: Int
        nome: String!
        email: String!
        idade:Int
        salario:Float
        vip: Boolean
        perfil: Perfil
    }

    type Produto{
        id: Int
        nome: String!
        preco: Float!
        desconto: Float
        precoComDesconto: Float
    }

    type Perfil{
        id: Int
        nome: String!
    }



    # Pontos de entrada da sua API!
    type Query{
        ola: String!
        horaAtual: Date!
        usuarioLogado: Usuario
        produtoEmDestaque: Produto
        numerosMegaSena: [Int!]!
        usuarios: [Usuario]
        usuario(id: Int) : Usuario
        perfis:[Perfil]
        perfil(id: Int) : Perfil

    }
`

const resolvers = {

    Usuario: {
        salario(usuario) {
            return usuario.salario_real
        },
        perfil(usuario){
            const selecionados = perfis
                .filter(u => u.id === usuario.perfil_id)
            return selecionados ? selecionados[0] : null
        }
    },

    Produto: {
        precoComDesconto(produto) {
            if (produto.desconto) {
                return produto.preco - produto.desconto
            } else {
                return produto.preco
            }
        },
    },

    Query: {
        ola() {
            return 'Bom dia'
        },
        horaAtual() {
            return `${new Date}`
        },
        usuarioLogado() {
            return {
                id: 1,
                nome: "Guilherme",
                email: "guilherme@gamil.com",
                idade: 23,
                salario_real: 1234.56,
                vip: true

            }
        },

        produtoEmDestaque() {
            return {
                id: 1,
                nome: "Notebook Gamer",
                preco: 200,
                desconto: 50
            }
        },

        numerosMegaSena() {
            //return[4, 8, 13, 27, 33, 54]

            const crescente = (a, b) => a - b
            return Array(6).fill(0)
                .map(n => parseInt(Math.random() * 60 + 1))
                .sort(crescente)
        },
        usuarios() {
            return usuarios
        },

        usuario(_, { id }) {
            const selecionados = usuarios
                .filter(u => u.id === id)
            return selecionados ? selecionados[0] : null
        },

        perfis(){
            return perfis
        },

        perfil(_,{ id }) {
            const selecionados = perfis
                .filter(p => p.id === id)
            return selecionados ? selecionados[0] : null
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => {
    console.log(`Executando em ${url}`);
})