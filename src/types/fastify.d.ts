import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<{ sub: string }>
    getMembership(params: { userId: string; serverId: string }): Promise<{
      id: string
      serverId: string
      userId: string
      role: string
    }>
  }
}
