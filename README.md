# Sistema de Envio de E-mails com Node.js

Este é um sistema desenvolvido em Node.js para envio automático de e-mails a partir de uma lista de destinatários em formato Excel. O sistema permite a configuração do servidor SMTP do remetente e o envio de e-mails com opção de anexar imagens ao corpo do e-mail.

## Funcionalidades

- **Configuração de Remetente SMTP**: Configure o servidor SMTP (host, porta, e-mail e senha) do remetente.
- **Envio de E-mails em Massa**: Envia e-mails em massa para uma lista de destinatários fornecida em formato Excel (.xlsx).
- **Intervalo Personalizado**: Defina o intervalo de tempo entre os envios dos e-mails para evitar bloqueios de spam.
- **Upload de Imagem Opcional**: Inclua uma imagem no corpo do e-mail, que pode ser anexada durante o envio.
- **Abertura Automática no Navegador**: O sistema abre automaticamente no navegador assim que o servidor é iniciado.
- **Persistência de Configurações**: As configurações de e-mail são salvas e carregadas automaticamente em execuções futuras.

## Pré-requisitos

Antes de iniciar, você precisará ter o [Node.js](https://nodejs.org/) instalado na sua máquina.

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/sistema-envio-email.git
