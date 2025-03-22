import { startServer } from './http/server'

async function main() {
  startServer()
}

main().catch((err) => console.log('Failed starting Koppy Logs.', err))
