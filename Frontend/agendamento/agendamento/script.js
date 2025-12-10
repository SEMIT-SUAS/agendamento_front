const tabela = document.getElementById("tabela-agendamentos");
const searchInput = document.getElementById("searchInput");
const BASE_URL = "http://192.168.200.34:8080/agendamentos";

let agendamentoAtual = null;

async function chamar(tipo) {
  try {
    const response = await fetch(`${BASE_URL}/chamar/${tipo}`, { method: "POST" });
    const text = await response.text(); // lê o corpo como texto

    let data;
    try {
      data = JSON.parse(text); // tenta converter em JSON
    } catch {
      data = null; // não é JSON
    }

    if (response.ok) {
      if (data?.agendamento) {
        agendamentoAtual = data.agendamento;
        abrirModalAgendamento();
      } else {
        agendamentoAtual = null;
        fecharModal();
        if (data?.mensagem) alert(data.mensagem);
      }

      carregarAgendamentos();
    } else {
      // status 500 ou outro erro
      console.log("❌ Erro do servidor: " + (data?.mensagem || text || response.statusText));
    }

  } catch (e) {
    alert("❌ " + e.message);
  }
}

function chamarNormal() { chamar("normal"); }
function chamarPrioridade() { chamar("prioridade"); }

// ------------------------- MODAL AGENDAMENTO -------------------------
function abrirModalAgendamento() {

  if (!agendamentoAtual) {
    console.warn("Nenhum agendamento para abrir modal");
    return;
  }

  document.getElementById("modalAtendimento").style.display = "flex";
  document.getElementById("modalInfo").innerText =
    `${agendamentoAtual.senha} - ${agendamentoAtual.usuarioNome}`;
}

function fecharModal() {
  try {
    const modal = document.getElementById("modalAtendimento");
    const modalDetalhes = document.getElementById("modalDetalhes");
    const modalInfo = document.getElementById("modalInfo");
    const detalhesContent = document.getElementById("detalhesContent");

    // Se elemento não existir, loga e retorna sem explodir
    if (modal) {
      modal.style.display = "none";
    } else {
      console.warn("fecharModal: #modalAtendimento não encontrado no DOM");
    }

    // também fecha o modal de detalhes se estiver aberto
    if (modalDetalhes) {
      modalDetalhes.style.display = "none";
    }

    // limpa textos/conteúdos pra evitar dados “fantasmas”
    if (modalInfo) modalInfo.innerText = "";
    if (detalhesContent) detalhesContent.innerHTML = "";

    // limpa estado
    agendamentoAtual = null;

    // libera trava se existir
    if (typeof modalAberto !== "undefined") modalAberto = false;

    console.log("fecharModal: modal fechado com sucesso");
  } catch (err) {
    console.error("fecharModal: erro ao fechar modal", err);
  }
}

function formatarSituacao(situacao) {
  if (!situacao) return "-";

  return situacao
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}

// ------------------------- DETALHES -------------------------
async function verDetalhes() {

  if (!agendamentoAtual || !agendamentoAtual.agendamentoId) {
    alert("Nenhum agendamento selecionado.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/detalhes`);
    if (!response.ok) throw new Error(await response.text());

    const dados = await response.json();

    const detalhe = dados.find(a =>
      Number(a.agendamentoId) === Number(agendamentoAtual.agendamentoId)
    );

    if (!detalhe) {
      alert("Detalhes não encontrados para esse agendamento");
      return;
    }

    const container = document.getElementById("detalhesContent");
    container.innerHTML = `
      <p><strong>Nome:</strong> ${detalhe.usuarioNome}</p>
      <p><strong>Serviço:</strong> ${detalhe.servicoNome}</p>
      <p><strong>Senha:</strong> ${detalhe.senha}</p>
      <p><strong>Situação:</strong> ${formatarSituacao(detalhe.situacao)}</p>
      <p><strong>Tipo Atendimento:</strong> ${detalhe.tipoAtendimento}</p>
      <p><strong>Data/Hora:</strong> ${new Date(detalhe.horaAgendamento).toLocaleString()}</p>
    `;

    document.getElementById("modalDetalhes").style.display = "flex";

  } catch(e) {
    alert("❌ " + e.message);
  }
}

// ------------------------- CANCELAR -------------------------
async function cancelarAgendamento() {

  console.log("🟡 agendamentoAtual:", agendamentoAtual);

  if (!agendamentoAtual || !agendamentoAtual.agendamentoId) {
    alert("❌ Nenhum agendamento selecionado.");
    return;
  }

  if (!confirm(`Cancelar a senha ${agendamentoAtual.senha}?`)) return;

  try {
    const response = await fetch(
      `${BASE_URL}/cancelar/${agendamentoAtual.agendamentoId}`,
      { method: "PUT" }
    );

    if (!response.ok) throw new Error(await response.text());

    alert("✅ Agendamento cancelado com sucesso!");
    fecharModal();
    carregarAgendamentos();

  } catch (e) {
    alert("❌ " + e.message);
  }
}

// ------------------------- TABELA -------------------------
async function carregarAgendamentos() {
  try {
    const response = await fetch(`${BASE_URL}/listar-todos`);
    const dados = await response.json();
    const lista = Array.isArray(dados) ? dados : (dados.content || dados.data || []);
    renderizarTabela(lista);
  } catch(e) {
    tabela.innerHTML = `<tr><td colspan="6">❌ Erro ao carregar agendamentos</td></tr>`;
  }
}

function renderizarTabela(lista) {
  tabela.innerHTML = "";
  const filtro = searchInput.value.toLowerCase();

  const dadosFiltrados = lista.filter(e =>
    (e.usuarioNome && e.usuarioNome.toLowerCase().includes(filtro)) ||
    (e.senha && e.senha.toLowerCase().includes(filtro)) ||
    (e.servicoNome && e.servicoNome.toLowerCase().includes(filtro))
  );

  if (dadosFiltrados.length === 0) {
    tabela.innerHTML = `<tr><td colspan="6">Nenhum registro encontrado</td></tr>`;
    return;
  }

 //  🔥 Auto abrir modal se existir alguém EM_ATENDIMENTO
const emAtendimento = dadosFiltrados.find(e => e.situacao === "EM_ATENDIMENTO");

if (emAtendimento && (!agendamentoAtual || agendamentoAtual.agendamentoId !== emAtendimento.agendamentoId)) {
  agendamentoAtual = emAtendimento;
  abrirModalAgendamento();
}

// 🔴 FECHAR automático se virar NAO_COMPARECEU
if (agendamentoAtual && agendamentoAtual.situacao === "NAO_COMPARECEU") {
  fecharModal();
}

  dadosFiltrados.forEach(e => {
    const data = e.horaAgendamento
      ? new Date(e.horaAgendamento).toLocaleString("pt-BR")
      : "-";

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><strong>${e.senha}</strong></td>
      <td>${e.usuarioNome}</td>
      <td>${e.servicoNome}</td>
      <td class="status-${e.situacao}">${formatarSituacao(e.situacao)}</td>
      <td>${e.tipoAtendimento}</td>
      <td>${data}</td>
    `;

    // ✅ CLICK NA LINHA = ABRIR MODAL
    tr.addEventListener("click", () => {
      agendamentoAtual = e;
      abrirModalAgendamento();
    });

    tabela.appendChild(tr);
  });
}

setInterval(carregarAgendamentos, 10000);
carregarAgendamentos();
searchInput.addEventListener("keyup", carregarAgendamentos);

// ------------------------- FECHAR MODAL DETALHES -------------------------
function fecharModalDetalhes() {
  const modal = document.getElementById("modalDetalhes");
  const container = document.getElementById("detalhesContent");

  if (modal) {
    modal.style.display = "none";
  }

  if (container) {
    container.innerHTML = ""; // limpa os detalhes
  }
}
