"""
scripts/stackspot_review.py
────────────────────────────────────────────────────────────────
Lê o HTML e o JS separados e envia para o agente StackSpot AI.
"""

import os
import sys
import json
import requests

CLIENT_ID     = os.environ["STACKSPOT_CLIENT_ID"]
CLIENT_SECRET = os.environ["STACKSPOT_CLIENT_SECRET"]
REALM         = os.environ["STACKSPOT_REALM"]
AGENT_ID      = os.environ["STACKSPOT_AGENT_ID"]

AUTH_URL  = f"https://idm.stackspot.com/{REALM}/oidc/oauth/token"
AGENT_URL = f"https://genai-inference-app.stackspot.com/v1/agent/{AGENT_ID}/chat"


def autenticar():
    print("ᓚᘏᗢ Autenticando na StackSpot AI...")
    r = requests.post(
        AUTH_URL,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data={
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "grant_type": "client_credentials",
        },
    )
    r.raise_for_status()
    token = r.json().get("access_token")
    if not token:
        print("ERRO: Token não retornado.")
        sys.exit(1)
    print("   Autenticado!")
    return token


def ler_arquivo(caminho):
    try:
        with open(caminho, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        print(f"AVISO: {caminho} não encontrado.")
        return ""


def carregar_jest():
    try:
        with open("jest-results.json") as f:
            d = json.load(f)
        return (
            f"Resultado Jest: {d.get('numPassedTests',0)}/"
            f"{d.get('numTotalTests',0)} testes passaram. "
            f"Sucesso: {d.get('success', False)}"
        )
    except FileNotFoundError:
        return "Resultado Jest: não encontrado."


def revisar(token, html, js, jest_info):
    print("ᓚᘏᗢ Enviando para o agente StackSpot AI...")
    prompt = f"""
Você é um revisor de segurança em uma pipeline CI/CD.

Analise o código abaixo com foco em:
1. Vulnerabilidades XSS (Cross-Site Scripting)
2. Uso inseguro de innerHTML, document.write ou eval
3. Falta de sanitização de input do usuário

{jest_info}

Conclua obrigatoriamente com:
- APROVADO — se o código estiver seguro
- REPROVADO: <motivo> — se encontrar vulnerabilidades críticas

--- index.html ---
{html}

--- assets/js/main.js ---
{js}
"""
    r = requests.post(
        AGENT_URL,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json={
            "streaming": False,
            "user_prompt": prompt,
            "stackspot_knowledge": True,
            "return_ks_in_response": False,
        },
    )
    r.raise_for_status()
    return r.json().get("message", "")


def decidir(mensagem):
    print("\n" + "="*60)
    print("ᓚᘏᗢ RESPOSTA DO AGENTE:")
    print(mensagem)
    print("="*60 + "\n")

    lower = mensagem.lower()
    if "reprovado" in lower:
        print("ᓚᘏᗢ REPROVADO — Deploy bloqueado. Corrija o XSS e faça novo push.")
        sys.exit(1)
    if "aprovado" in lower:
        print("ᓚᘏᗢ APROVADO — Prosseguindo para o deploy!")
        sys.exit(0)

    print("ᓚᘏᗢ Resposta ambígua — aprovando com ressalvas.")
    sys.exit(0)


if __name__ == "__main__":
    token     = autenticar()
    html      = ler_arquivo("index.html")
    js        = ler_arquivo("assets/js/main.js")
    jest_info = carregar_jest()
    resposta  = revisar(token, html, js, jest_info)
    decidir(resposta)
