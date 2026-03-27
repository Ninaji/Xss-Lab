// tests/xss.test.js

const fs   = require("fs");
const path = require("path");

const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
const js   = fs.readFileSync(path.resolve(__dirname, "../assets/js/main.js"), "utf8");

beforeEach(() => {
  document.documentElement.innerHTML = html;

  // Executa o JS no escopo global do jsdom
  const scriptEl = document.createElement("script");
  scriptEl.textContent = js;
  document.body.appendChild(scriptEl);
});

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

describe("Comportamento da busca", () => {
  test("resultado fica oculto antes de buscar", () => {
    const resultado = document.getElementById("resultado");
    expect(resultado.classList.contains("visivel")).toBe(false);
  });

  test("resultado aparece após buscar", () => {
    document.getElementById("input-busca").value = "teste";
    window.buscar();
    expect(document.getElementById("resultado").classList.contains("visivel")).toBe(true);
  });

  test("innerHTML executa HTML do usuário — comportamento vulnerável a XSS", () => {
    document.getElementById("input-busca").value = "<b>negrito</b>";
    window.buscar();
    const termoEl = document.getElementById("termo");
    expect(termoEl.querySelector("b")).not.toBeNull();
  });
});
