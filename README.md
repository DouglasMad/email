Sistema de Envio de E-mails com Node.js

Este é um sistema desenvolvido em Node.js para envio automático de e-mails a partir de uma lista de destinatários em formato Excel. O sistema permite a configuração do servidor SMTP do remetente e o envio de e-mails com opção de anexar imagens ao corpo do e-mail.

Funcionalidades
Configuração de Remetente SMTP: Configure o servidor SMTP (host, porta, e-mail e senha) do remetente.
Envio de E-mails em Massa: Envia e-mails em massa para uma lista de destinatários fornecida em formato Excel (.xlsx).
Intervalo Personalizado: Defina o intervalo de tempo entre os envios dos e-mails para evitar bloqueios de spam.
Upload de Imagem Opcional: Inclua uma imagem no corpo do e-mail, que pode ser anexada durante o envio.
Abertura Automática no Navegador: O sistema abre automaticamente no navegador assim que o servidor é iniciado.
Persistência de Configurações: As configurações de e-mail são salvas e carregadas automaticamente em execuções futuras.
Pré-requisitos
Antes de iniciar, você precisará ter o Node.js instalado na sua máquina.

Instalação
Clone este repositório:

bash
Copiar código
git clone https://github.com/seu-usuario/sistema-envio-email.git
Acesse o diretório do projeto:

bash
Copiar código
cd sistema-envio-email
Instale as dependências do projeto:

bash
Copiar código
npm install
Como Usar
Modo de Desenvolvimento
Se você quiser rodar o projeto no modo de desenvolvimento (sem criar o executável), siga as instruções abaixo:

Inicie o servidor:

bash
Copiar código
npm start
O sistema será aberto automaticamente no navegador em http://localhost:3000.

Modo Executável
Se você quiser gerar um executável para Windows usando o pkg, siga os passos abaixo:

Instale o pkg globalmente, caso ainda não tenha:

bash
Copiar código
npm install -g pkg
Gere o executável:

bash
Copiar código
pkg . --targets node16-win
Execute o arquivo gerado (.exe), que será criado na pasta do projeto. Ele abrirá automaticamente no navegador.

Estrutura do Projeto
java
Copiar código
/public
  ├── img/
  │    └── logo.png
  ├── index.html
  ├── configuracao.html
  └── envio.html
emailConfig.json     (Arquivo de configuração salvo automaticamente)
server.js            (Script principal do sistema)
package.json         (Arquivo de configuração do Node.js)
Explicação dos Arquivos
public/: Contém os arquivos HTML da interface do sistema.
server.js: O arquivo principal que contém o servidor Node.js e a lógica de envio de e-mails.
emailConfig.json: Armazena as configurações de e-mail do remetente (será criado automaticamente).
package.json: Arquivo de configuração do projeto Node.js, com as dependências e informações do projeto.
Como Funciona
Configuração do Remetente: Na página inicial, clique em "Configurar Remetente". Preencha as informações de e-mail, senha, host SMTP, e porta SMTP. Essa configuração será salva para uso futuro.

Envio de E-mails: Na página de envio, faça o upload da lista de e-mails em formato Excel (.xlsx). A lista deve conter uma coluna de e-mails válida. Opcionalmente, você pode adicionar uma imagem ao corpo do e-mail. Defina o intervalo entre os envios para evitar ser marcado como spam.

Status: O sistema exibirá o status de envio dos e-mails e informará quando todos os e-mails tiverem sido processados.

Tecnologias Utilizadas
Node.js: Ambiente de execução para o código JavaScript no lado do servidor.
Express: Framework para criação de servidores web.
Multer: Middleware para manipulação de uploads de arquivos.
Nodemailer: Biblioteca para envio de e-mails via SMTP.
xlsx: Biblioteca para manipulação de arquivos Excel.
pkg: Ferramenta para empacotamento do Node.js em um executável.
Contribuições
Contribuições são sempre bem-vindas! Se você quiser colaborar, siga as etapas abaixo:

Faça um fork do projeto.
Crie uma nova branch (git checkout -b feature/nova-funcionalidade).
Faça as alterações necessárias e commit (git commit -m 'Adiciona nova funcionalidade').
Envie as alterações para sua branch (git push origin feature/nova-funcionalidade).
Abra um Pull Request.
Licença
Este projeto está licenciado sob a MIT License.
