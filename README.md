# Meu Repositor

Aplicativo PWA pessoal para uso no trabalho como repositor de supermercado.

**Não é** um sistema de estoque completo do mercado. É uma ferramenta pessoal
para facilitar o dia a dia, com foco em:

1. Controlar produtos que precisam ser repostos.
2. Registrar e acompanhar validades.
3. Identificar produtos através do código de barras.
4. Manter um cadastro próprio de produtos.

## Status do projeto

✅ **Completo.** As 15 etapas planejadas foram concluídas — veja
`docs/changelog.md` para o histórico detalhado de cada uma.

O app está pronto para uso real no dia a dia. Ajustes futuros devem
partir de necessidades observadas no uso, não de um plano pré-definido
— veja "Limitações conhecidas" abaixo para o que ficou de fora de
propósito.

## Tecnologias

- HTML5, CSS3, JavaScript (sem frameworks pesados)
- IndexedDB (armazenamento local persistente)
- PWA: Web App Manifest + Service Worker
- 100% offline após instalação/carregamento — sem backend, sem dependência
  de servidor para as funções principais

## Estrutura do projeto

```
meu-repositor/
├── index.html
├── manifest.json
├── sw.js
├── README.md
│
├── assets/
│   ├── icons/       (ícones do PWA — adicionados na Etapa 2)
│   └── images/
│
├── css/
│   ├── main.css
│   ├── components.css
│   ├── layout.css
│   └── responsive.css
│
├── js/
│   ├── app.js               (ponto de entrada)
│   ├── db/                  (camada de acesso ao IndexedDB)
│   ├── pages/                (telas: início, reposição, validades, produtos, config)
│   ├── components/           (componentes reutilizáveis: scanner, cards, modal, toast)
│   ├── utils/                 (funções utilitárias: datas, formatação, validação)
│   └── config/                (configurações globais do app)
│
└── docs/
    ├── architecture.md
    ├── database.md
    └── changelog.md
```

## Como executar (durante o desenvolvimento)

Como o app usa `fetch`/módulos ES e Service Worker, ele precisa ser servido
por um servidor local (não funciona abrindo o `index.html` direto pelo
`file://`). Por exemplo, com Python instalado:

```bash
cd meu-repositor
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080` no navegador do celular ou do
computador (na mesma rede, use o IP do computador em vez de `localhost`
para testar no celular).

*(A partir da Etapa 2, esta seção será detalhada com o passo a passo de
instalação como PWA no Android.)*

## Como instalar como PWA (Android)

1. Sirva os arquivos por HTTPS (ou `localhost`, que o navegador trata
   como seguro) — o Service Worker não funciona em `http://` normal na
   rede.
2. Abra o endereço no Chrome do Android.
3. Toque no menu (⋮) e escolha **"Adicionar à tela inicial"** (ou
   aguarde o banner de instalação automático do Chrome).
4. O app abrirá em modo standalone (sem a barra de endereço do
   navegador), com o ícone "MR" criado nesta etapa como placeholder.

## Limitações conhecidas

- Os ícones em `assets/icons/` são placeholders gerados automaticamente
  (texto "MR"); podem ser substituídos por um ícone definitivo a
  qualquer momento, sem exigir mudança de código.
- **Produtos**: cadastrar, listar, editar, excluir produtos, gerenciar
  códigos de barras (manual ou câmera) e marcar/desmarcar para
  reposição. Busca por texto e filtro por marca disponíveis na lista.
- **Reposição**: marcar um produto para repor (botão "📦" no card, na
  tela Produtos), três abas na tela Reposição — Pendentes, Concluídos
  e Falta (item que não pôde ser reposto por falta de estoque) — com
  ações para concluir, marcar falta e reativar (voltar para
  pendente). Nenhuma dessas transições cria registros duplicados.
- **Validades**: cadastro nos detalhes de um produto (botão "🔗" no
  card), com lista geral na tela Validades ordenada por urgência
  (vencido → crítico → atenção → normal) e badge de status. Pode ser
  removida tanto pelos detalhes do produto quanto pela lista geral —
  os dois caminhos registram o mesmo evento no Histórico.
- **Início (Dashboard)**: números reais de reposição pendente,
  validades próximas e produtos cadastrados, com os cards clicáveis
  levando direto a cada aba.
- **Histórico**: cada evento importante (produto criado/editado/
  excluído, código adicionado/removido, produto marcado para repor,
  reposição concluída/marcada como falta, validade cadastrada/
  removida) fica registrado com data/hora. Acessível pela tela
  Configurações, botão "📜 Ver histórico"; "Limpar histórico" (com
  confirmação) também está disponível ali. **Limitação conhecida:** a
  lista não é paginada nem tem limite de tamanho — num uso diário
  prolongado, o histórico pode crescer bastante; se isso incomodar no
  uso real, dá para adicionar um limite de exibição ou de retenção
  depois.
- Leitor de código de barras por câmera usa `BarcodeDetector` quando
  disponível, com entrada manual sempre como alternativa (nunca é
  obrigatório usar a câmera).
- **Backup e restauração**: em Configurações, "💾 Fazer backup" baixa
  um arquivo `.json` com todos os dados do app (produtos, códigos,
  reposição, validades e histórico); "♻️ Restaurar backup" lê um
  arquivo desses, pede confirmação (a restauração **substitui** todos
  os dados atuais, não mescla) e recarrega o app com os dados
  restaurados, preservando os ids originais dos registros. A tela
  mostra a data do último backup feito neste aparelho. **Limitação
  conhecida:** o backup é um arquivo local que o usuário precisa
  guardar por conta própria (ex.: enviando para um Drive/nuvem
  manualmente) — o app não faz upload automático para nenhum serviço,
  por ser 100% client-side e sem backend.
- **Diagnóstico**: em Configurações, "🔧 Ver diagnóstico" mostra
  informações de ambiente (suporte do navegador, uso de armazenamento,
  conexão) e os últimos erros capturados automaticamente pelo app —
  com botões para copiar tudo isso como texto (útil para relatar um
  problema) e para limpar o log. Erros de qualquer parte do app
  (IndexedDB, telas, ou qualquer erro inesperado não tratado
  especificamente) são registrados automaticamente, sem precisar de
  nenhuma ação manual.
- **Refinamento de interface/mobile**: transição suave entre abas,
  área segura de notch/ilha dinâmica no header, feedback tátil em
  botões e cards, filtros da tela Produtos fixos ao rolar, modal e
  leitor de código fecham com Esc, toast acessível para leitores de
  tela e feedback visual (botão desabilitado + texto) durante backup e
  restauração. Tudo respeita a preferência do sistema por menos
  movimento (`prefers-reduced-motion`).
- `js/utils/validation.js` foi mantido como um esqueleto vazio
  (decisão deliberada, não uma etapa pendente) — as validações que
  surgiram ao longo do projeto são poucas e específicas o bastante
  para ficarem junto da regra de negócio de cada entidade, em
  `js/db/*`. Veja o comentário no próprio arquivo.

## Próximos passos

Nenhum passo planejado — o projeto está completo. Veja
`docs/changelog.md` para o histórico completo das 15 etapas. Qualquer
evolução futura (ex.: reabrir um item de reposição já concluído,
paginar o Histórico, permitir quantidade nos itens) deve partir de uma
necessidade real observada no uso, não de um plano pré-definido.
