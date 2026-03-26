// tests/xss.test.js
// ─────────────────────────────────────────────────────────────
// Testes do index.html + assets/js/main.js usando jsdom
// ─────────────────────────────────────────────────────────────

const fs   = require("fs");
const path = require("path");

// Lê o HTML e o JS separadamente
const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
const js   = fs.readFileSync(path.resolve(__dirname, "../assets/js/main.js"), "utf8");

beforeEach(() => {
  document.documentElement.innerHTML = html;
  eval(js); // carrega o main.js no ambiente de teste
});

// ── Estrutura da página ───────────────────────────────────────
describe("Estrutura da página", () => {
  test("deve ter campo de busca", () => {
    expect(document.getElementById("input-busca")).not.toBeNull();
  });

  test("deve ter botão de buscar", () => {
    expect(document.querySelector(".btn-buscar")).not.toBeNull();
  });

  test("deve ter div de resultado", () => {
    expect(document.getElementById("resultado")).not.toBeNull();
  });
});

// ── Comportamento ─────────────────────────────────────────────
describe("Comportamento da busca", () => {
  test("resultado fica oculto antes de buscar", () => {
    const resultado = document.getElementById("resultado");
    expect(resultado.classList.contains("visivel")).toBe(false);
  });

  test("resultado aparece após buscar", () => {
    document.getElementById("input-busca").value = "teste";
    buscar();
    expect(document.getElementById("resultado").classList.contains("visivel")).toBe(true);
  });

  // ⚠ Confirma que o XSS existe — o Jest verifica comportamento,
  //   a IA da StackSpot verifica segurança
  test("innerHTML executa HTML do usuário — comportamento vulnerável a XSS", () => {
    document.getElementById("input-busca").value = "<b>negrito</b>";
    buscar();
    const termoEl = document.getElementById("termo");
    expect(termoEl.querySelector("b")).not.toBeNull();
  });
});
