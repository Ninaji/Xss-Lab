// assets/js/main.js
// ─────────────────────────────────────────────────────────────
// Lógica da barra de busca
//
// ⚠ VULNERABILIDADE XSS AQUI:
//   A função buscar() usa innerHTML para exibir o que o usuário digitou.
//   innerHTML interpreta HTML e JavaScript — então se o usuário digitar
//   <script>alert('xss')</script> o navegador VAI executar.
//
// CORREÇÃO:
//   Trocar a linha com innerHTML por:
//   termoEl.textContent = termo;
//   textContent trata tudo como texto puro, nunca executa como código.
// ─────────────────────────────────────────────────────────────

function buscar() {
  const termo    = document.getElementById('input-busca').value;
  const resultado = document.getElementById('resultado');
  const termoEl  = document.getElementById('termo');

  if (!termo) return;

  resultado.classList.add('visivel');

  // ⚠ LINHA VULNERÁVEL — o agente StackSpot vai reprovar por causa disso
  termoEl.innerHTML = termo;

  // VERSÃO CORRIGIDA (descomente e apague a linha acima para corrigir):
  // termoEl.textContent = termo;
}

// Permite buscar apertando Enter
document.getElementById('input-busca').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') buscar();
});
