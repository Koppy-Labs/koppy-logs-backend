import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>
        Bem-vindo à Koppy Logs! Complete sua configuração para começar.
      </Preview>
      <Tailwind>
        <Body className="bg-[#09090b] font-sans">
          <Container className="mx-auto py-[32px] px-[12px]">
            <Section className="bg-[#18181b] rounded-[12px] p-[32px] shadow-lg border border-[#27272a]">
              <Heading className="text-[28px] font-bold text-white mb-[24px]">
                Bem-vindo à Koppy Logs, {name}!
              </Heading>

              <Text className="text-[16px] text-[#a1a1aa] mb-[20px]">
                Obrigado por escolher a Koppy Logs para o monitoramento do seu
                servidor FiveM. Estamos animados em tê-lo conosco!
              </Text>

              <Text className="text-[16px] text-[#a1a1aa] mb-[28px]">
                Nossa plataforma moderna de logging foi desenvolvida
                especialmente para servidores FiveM, oferecendo monitoramento em
                tempo real, alertas personalizados e painéis de controle
                intuitivos.
              </Text>

              <Button
                className="bg-[#f5f5f5] hover:bg-[#e5e5e5] text-black font-medium py-[12px] px-[24px] rounded-[6px] text-[16px] no-underline text-center block box-border"
                href="https://logs.koppy.app/server/setup"
              >
                Completar Configuração
              </Button>

              <Section className="border-t border-[#27272a] my-[28px]"></Section>

              <Text className="text-[16px] text-[#a1a1aa] mb-[20px]">
                Para começar a aproveitar todos os recursos da Koppy Logs,
                complete a configuração do seu painel de controle e conecte seu
                servidor FiveM.
              </Text>

              <Text className="text-[16px] text-[#a1a1aa] mb-[8px]">
                Se tiver alguma dúvida, responda a este email ou entre em
                contato com nossa equipe de suporte através do Discord.
              </Text>

              <Text className="text-[16px] text-[#a1a1aa] font-medium">
                Equipe Koppy Logs
              </Text>
            </Section>

            <Section className="mt-[24px] text-center text-[#71717a] text-[12px]">
              <Text className="m-0">
                © 2025 Koppy Logs. Todos os direitos reservados.
              </Text>
              <Text className="m-0">
                Av. Paulista, 1000, São Paulo, SP, Brasil
              </Text>
              <Text className="m-0">
                <a
                  href="https://koppylogs.com/cancelar-inscricao"
                  className="text-[#71717a] underline"
                >
                  Cancelar inscrição
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
