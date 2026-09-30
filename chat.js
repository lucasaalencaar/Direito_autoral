// ── CHATBOT: conversa com o backend Python em /api/chat ──

(function () {
  const API_URL = '/api/chat';
  const historico = [];   // guarda a conversa para o bot ter contexto

  // ── monta o HTML do chat ──
  const botao = document.createElement('button');
  botao.id = 'chatBtn';
  botao.textContent = '§';
  botao.setAttribute('aria-label', 'Abrir assistente');

  const painel = document.createElement('div');
  painel.id = 'chatPanel';
  painel.setAttribute('role', 'dialog');
  painel.setAttribute('aria-label', 'Assistente de propriedade intelectual');
  painel.innerHTML = `
    <div class="chat-head">
      <div>
        <div class="chat-head-titulo">Assistente jurídico</div>
        <div class="chat-head-sub">Direito autoral e patentes em TI</div>
      </div>
      <button class="chat-fechar" aria-label="Fechar">×</button>
    </div>
    <div class="chat-msgs" id="chatMsgs" aria-live="polite"></div>
    <div class="chat-sugestoes" id="chatSugestoes">
      <button type="button">Software pode ser patenteado?</button>
      <button type="button">Preciso registrar meu código no INPI?</button>
      <button type="button">Quanto tempo dura a proteção?</button>
    </div>
    <form class="chat-form" id="chatForm">
      <input id="chatInput" type="text" maxlength="1000" placeholder="Faça sua pergunta..." autocomplete="off">
      <button type="submit" id="chatEnviar">Enviar</button>
    </form>
    <div class="chat-aviso">Conteúdo educacional. Não substitui consulta a um advogado.</div>
  `;

  document.body.appendChild(botao);
  document.body.appendChild(painel);

  const msgs      = painel.querySelector('#chatMsgs');
  const form      = painel.querySelector('#chatForm');
  const input     = painel.querySelector('#chatInput');
  const enviarBtn = painel.querySelector('#chatEnviar');
  const sugestoes = painel.querySelector('#chatSugestoes');

  // ── converte texto simples do Gemini em HTML seguro ──
  function formatar(texto) {
    const seguro = texto
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return seguro
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')   // **negrito**
      .replace(/^\s*[-*]\s+/gm, '• ')                      // listas
      .replace(/\n/g, '<br>');                             // quebras de linha
  }

  function adicionarMsg(texto, tipo) {
    const div = document.createElement('div');
    div.className = `msg msg-${tipo}`;
    div.innerHTML = formatar(texto);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  // mensagem de boas-vindas
  adicionarMsg('Olá! Posso tirar dúvidas sobre direito autoral de software, registro de patentes e a legislação de TI no Brasil. O que você quer saber?', 'bot');

  // ── abrir e fechar ──
  botao.addEventListener('click', () => {
    painel.classList.toggle('aberto');
    if (painel.classList.contains('aberto')) input.focus();
  });
  painel.querySelector('.chat-fechar').addEventListener('click', () => {
    painel.classList.remove('aberto');
    botao.focus();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') painel.classList.remove('aberto');
  });

  // ── enviar pergunta ──
  async function enviar(pergunta) {
    pergunta = pergunta.trim();
    if (!pergunta) return;

    sugestoes.style.display = 'none';
    adicionarMsg(pergunta, 'user');
    input.value = '';
    input.disabled = true;
    enviarBtn.disabled = true;

    const digitando = adicionarMsg('Digitando...', 'bot');
    digitando.classList.add('msg-digitando');

    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: pergunta, historico: historico })
      });
      const dados = await resp.json();
      digitando.remove();

      if (!resp.ok) {
        adicionarMsg(dados.erro || 'Algo deu errado. Tente de novo.', 'erro');
        return;
      }

      adicionarMsg(dados.resposta, 'bot');
      historico.push({ papel: 'user',  texto: pergunta });
      historico.push({ papel: 'model', texto: dados.resposta });

    } catch (erro) {
      digitando.remove();
      adicionarMsg('Não foi possível conectar ao assistente. Verifique se o servidor está no ar.', 'erro');
    } finally {
      input.disabled = false;
      enviarBtn.disabled = false;
      input.focus();
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    enviar(input.value);
  });

  sugestoes.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => enviar(b.textContent));
  });
})();
