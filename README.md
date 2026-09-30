
§ Direito da Informática
Site estático e educacional sobre Direito Autoral e Registro de Patente na Informática, com base na legislação federal brasileira. O conteúdo explica como software, hardware e invenções tecnológicas são protegidos juridicamente no Brasil, e inclui um assistente virtual para tirar dúvidas sobre o tema.

Conteúdo com fins educacionais. Não substitui consulta a um advogado especializado.

Conteúdo do site
Seção	O que apresenta
Sobre	O princípio da coexistência de regimes de proteção
Comparativo	Tabela Direito Autoral vs. Registro de Patente na TI
Direito Autoral	Proteção do software pela Lei nº 9.609/1998
Patentes	Invenções implementadas por computador e exemplos
Circuitos	Topografia de circuitos integrados (Lei nº 11.484/2007)
Referências	Fontes doutrinárias e bibliográficas
Legislação	Links para os textos oficiais no Planalto e no INPI
Assistente	Chat para perguntas sobre propriedade intelectual em TI
Estrutura dos arquivos
site_direito/
├── index.html    # estrutura e conteúdo da página
├── style.css     # estilo visual do site (cores, fontes, layout)
├── script.js     # menu mobile, botão voltar ao topo e animações
├── chat.css      # estilo do assistente virtual
└── chat.js       # funcionamento do assistente virtual
Tecnologias
HTML5 — estrutura semântica da página
CSS3 — layout com Grid e Flexbox, responsivo para celular
JavaScript puro — sem frameworks ou bibliotecas
Google Fonts — Source Serif 4 (títulos) e Inter (textos)
Como rodar localmente
Não precisa instalar nada. Basta servir a pasta com qualquer servidor web.

Com Python:

bash
cd site_direito
python3 -m http.server 8080
Acesse http://localhost:8080.

Com Apache2 (Linux):

bash
sudo mkdir -p /var/www/html/site_direito
sudo cp index.html style.css script.js chat.css chat.js /var/www/html/site_direito/
sudo chown -R www-data:www-data /var/www/html/site_direito
Acesse http://IP_DO_SERVIDOR/site_direito.

As fontes são carregadas do Google Fonts, então o servidor precisa de acesso à internet para exibi-las. Sem internet, o site funciona normalmente com as fontes padrão do sistema.

Sobre o assistente virtual
O chat.js envia as perguntas para o endereço /api/chat, que deve ser atendido por um backend separado. Sem esse backend, o site funciona normalmente, mas o assistente exibe uma mensagem de erro ao tentar responder.

Para apontar o chat para outro endereço de backend, altere a primeira linha de configuração do chat.js:

javascript
const API_URL = '/api/chat';
A comunicação usa JSON:

javascript
// envio
{ "mensagem": "Software pode ser patenteado?", "historico": [...] }

// resposta de sucesso
{ "resposta": "texto da resposta" }

// resposta de erro
{ "erro": "mensagem de erro" }
Hospedagem na AWS S3
Por ser um site estático, o front-end pode ser hospedado em um bucket S3 com a opção Static website hosting ativada:

Criar um bucket e enviar os 5 arquivos
Em Properties, ativar Static website hosting com index.html como documento de índice
Em Permissions, liberar o acesso público de leitura com uma bucket policy:
json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::NOME_DO_BUCKET/*"
  }]
}
O S3 hospeda apenas arquivos estáticos. Para o assistente funcionar na AWS, o backend precisa rodar em outro serviço (como EC2 ou Lambda), e o API_URL do chat.js deve apontar para o endereço dele.

Legislação de referência
Lei nº 9.609/1998 — Lei do Software
Lei nº 9.610/1998 — Lei de Direitos Autorais
Lei nº 9.279/1996 — Lei da Propriedade Industrial
Diretrizes do INPI para Invenções Implementadas por Computador








