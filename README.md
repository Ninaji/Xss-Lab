# XSS Lab — CI/CD com StackSpot AI

Laboratorio de segurança com pipeline automatica de testes e revisao de codigo via StackSpot AI.

---

## Pipeline

Cada `git push` para `main` dispara o GitHub Actions:

```
Jest -> StackSpot AI Review -> Deploy
```

Se qualquer etapa falhar, as proximas nao rodam.

---

## Estrutura

```
xss-lab/
├── .github/workflows/ci-cd.yml       <- GitHub Actions
├── assets/
│   ├── css/style.css
│   └── js/main.js                    <- revisado pelo agente
├── scripts/
│   ├── stackspot_review.py           <- review concatenado
│   └── stackspot_review_threads.py   <- review em paralelo
├── tests/xss.test.js
├── .env.example
├── .reviewignore                     <- arquivos ignorados pelo agente
├── index.html
├── package.json
└── requirements.txt
```

---

## Vulnerabilidade

`assets/js/main.js` injeta input do usuario via `innerHTML`:

```javascript
termoEl.innerHTML = termo; // executa HTML/JS arbitrario
```

Payload de exemplo:
```
<img src=x onerror="alert(document.cookie)">
```

Correcao:
```javascript
termoEl.textContent = termo; // trata como texto puro
```

O agente reprova o codigo enquanto `innerHTML` estiver presente.

---

## Secrets no GitHub

**Settings -> Secrets and variables -> Actions**

| Secret | Origem |
|---|---|
| `STACKSPOT_CLIENT_ID` | Service Credentials |
| `STACKSPOT_CLIENT_SECRET` | Service Credentials |
| `STACKSPOT_REALM` | Nome da organizacao na URL do portal |
| `STACKSPOT_AGENT_ID` | Agents -> API Usage |

---

## Setup

```
npm install
pip install -r requirements.txt
cp .env.example .env
# preencher .env com as credenciais
```

---

## Comandos

| Comando | O que faz |
|---|---|
| `npm test` | Jest |
| `npm run review` | agente — todos os arquivos em 1 chamada |
| `npm run review:threads` | agente — 1 chamada por arquivo em paralelo |
| `npm run pipeline` | Jest + review concatenado |
| `npm run pipeline:threads` | Jest + review em paralelo |

---

## Observacoes

- `.env` nunca sobe ao repositorio — usar `.env.example` como referencia
- `.reviewignore` segue a mesma logica do `.gitignore`
- No Windows, adicionar `.github/` manualmente se nao for incluido no `git add .`:
  ```
  git add .github/workflows/ci-cd.yml
  ```
