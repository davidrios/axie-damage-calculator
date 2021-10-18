import axios from 'axios'

const mktApi = axios.create({ baseURL: 'https://graphql-gateway.axieinfinity.com' })

export { mktApi }
