
function buscar() {
  const termo     = document.getElementById('input-busca').value;
  const resultado = document.getElementById('resultado');
  const termoEl   = document.getElementById('termo');

  if (!termo) return;

  resultado.classList.add('visivel');
 
  termoEl.innerHTML = termo;
}

if (typeof window !== 'undefined') {
  window.buscar = buscar;
}


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
