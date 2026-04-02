// tests/xss.test.js

const fs   = require("fs");
const path = require("path");

const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");

// Importa a funcao diretamente do main.js via require
// Para isso o main.js precisa exportar a funcao
const { buscar } = require("../assets/js/main.js");

beforeEach(() => {
  document.documentElement.innerHTML = html;
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
    buscar();
    expect(document.getElementById("resultado").classList.contains("visivel")).toBe(true);
  });

  // test("innerHTML executa HTML do usuário — comportamento vulnerável a XSS", () => {
  //   document.getElementById("input-busca").value = "<b>negrito</b>";
  //   buscar();
  //   const termoEl = document.getElementById("termo");
  //   expect(termoEl.querySelector("b")).not.toBeNull();
  // });
});
