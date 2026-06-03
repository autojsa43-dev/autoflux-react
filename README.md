# JSA Auto - versão visual fiel com backend

Esta versão mantém o visual do HTML final enviado e troca a parte de senhas para Supabase Auth.

## Importante

- Senhas não ficam no front-end.
- Senhas não ficam em `localStorage`.
- O front-end usa apenas a `anon key` pública do Supabase.
- A `service_role key` fica apenas na Edge Function do Supabase.

## Onde configurar o Supabase

Abra `index.html` e troque:

```js
const SUPABASE_URL = "COLE_AQUI_SUA_SUPABASE_URL";
const SUPABASE_ANON_KEY = "COLE_AQUI_SUA_SUPABASE_ANON_KEY";
```

## Publicação GitHub Pages

Este projeto está com `base: '/autoflux-react/'` no `vite.config.js`.

Link esperado:

```text
https://autojsa43-dev.github.io/autoflux-react/
```

## Supabase

Leia `docs/CONFIGURAR_SUPABASE.md`.


## Supabase configurado

Este pacote já está configurado com:

- Project URL: `https://vohvdkugywfpobyizlnu.supabase.co`
- Publishable/public key: configurada no `index.html`

Não coloque `service_role` ou `secret key` no GitHub.
