// assets/js/main.js

// ⚠ VULNERABILIDADE XSS AQUI:
// innerHTML interpreta HTML e executa JavaScript do usuario.
// CORRECAO: trocar innerHTML por textContent

function buscar() {
  const termo     = document.getElementById('input-busca').value;
  const resultado = document.getElementById('resultado');
  const termoEl   = document.getElementById('termo');

  if (!termo) return;

  resultado.classList.add('visivel');

  // ⚠ LINHA VULNERAVEL
  termoEl.innerHTML = termo;

  // VERSAO CORRIGIDA (descomente e apague a linha acima):
  // termoEl.textContent = termo;
}

// Expoe no escopo global para o navegador
if (typeof window !== 'undefined') {
  window.buscar = buscar;
}

// Permite buscar apertando Enter — so roda no navegador
const inputBusca = document.getElementById('input-busca');
if (inputBusca) {
  inputBusca.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') buscar();
  });
}

// Exporta para os testes Jest 2
if (typeof module !== 'undefined') {
  module.exports = { buscar };
}
