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

import { env } from '@/env'

export function AccountCreationEmail({
  name,
  verificationToken,
  verificationCode,
  email,
}: {
  name: string
  verificationToken: string
  verificationCode: string
  email: string
}) {
  return (
    <Html>
      <Head />
      <Preview>
        Confirme sua conta na Koppy Logs para começar a monitorar seu servidor
        FiveM
      </Preview>
      <Tailwind>
        <Body className="bg-[#09090b] font-sans">
          <Container className="mx-auto py-[32px] px-[12px]">
            <Section className="bg-[#18181b] rounded-[12px] p-[32px] shadow-lg border border-[#27272a]">
              <Heading className="text-[28px] font-bold text-white mb-[24px]">
                Ative sua conta, {name}
              </Heading>

              <Text className="text-[16px] text-[#a1a1aa] mb-[20px]">
                Sua conta na Koppy Logs foi criada com sucesso. Para começar a
                monitorar seu servidor FiveM, confirme sua conta clicando no
                botão abaixo.
              </Text>

              <Button
                className="bg-[#f5f5f5] hover:bg-[#e5e5e5] text-black font-medium py-[12px] px-[24px] rounded-[6px] text-[16px] no-underline text-center block box-border"
                href={`${env.app.CLIENT_URL}/verify-account?email=${email}&code=${verificationToken}`}
              >
                Ativar Minha Conta
              </Button>

              <Section className="border-t border-[#27272a] my-[28px]"></Section>

              <Text className="text-[16px] text-[#a1a1aa] mb-[20px]">
                Se o botão acima não funcionar, você também pode ativar sua
                conta inserindo o código de verificação abaixo no nosso site:
              </Text>

              <Section className="bg-[#27272a] rounded-[6px] p-[16px] text-center mb-[24px]">
                <Text className="text-[20px] font-mono text-white tracking-[2px] m-0">
                  {verificationCode}
                </Text>
              </Section>

              <Text className="text-[16px] text-[#a1a1aa] mb-[20px]">
                Após a ativação, você terá acesso ao painel de controle completo
                da Koppy Logs, onde poderá:
              </Text>

              <ul className="text-[16px] text-[#a1a1aa] mb-[20px] pl-[20px]">
                <li className="mb-[8px]">
                  Configurar o monitoramento do seu servidor FiveM
                </li>
                <li className="mb-[8px]">
                  Personalizar alertas e notificações
                </li>
                <li className="mb-[8px]">Acessar logs em tempo real</li>
                <li className="mb-[8px]">
                  Visualizar estatísticas e métricas de desempenho
                </li>
              </ul>

              <Text className="text-[16px] text-[#a1a1aa] mb-[8px]">
                Este link de ativação expirará em 24 horas. Se você não
                solicitou esta conta, ignore este email.
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
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
