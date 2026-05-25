# SoDi Games — Cloudflare Pages deploy

This deploys `src/` to Cloudflare Pages. The Pages **project** is created with
Terraform; the **static assets** are uploaded with `wrangler` (Cloudflare's CLI).
This split is intentional: Terraform owns long-lived infra, Wrangler ships bits.

## Prerequisites

1. A Cloudflare account (free tier is fine).
2. [Terraform](https://developer.hashicorp.com/terraform/install) ≥ 1.5.
3. [Node.js](https://nodejs.org/) ≥ 18 (for `wrangler`).
4. A Cloudflare **API token** with these permissions:
   - `Account` → `Cloudflare Pages` → **Edit**
   - `Account` → `Account Settings` → **Read**
   - (Optional, only if using `custom_domain`) `Zone` → `DNS` → **Edit** for that zone

   Create one at: https://dash.cloudflare.com/profile/api-tokens
5. Your Cloudflare **Account ID** — shown on the right sidebar of any zone, or
   under "Workers & Pages" → "Overview".

## One-time setup

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# edit terraform.tfvars and fill in api_token + account_id

terraform init
terraform apply
```

`terraform apply` creates the Pages project (no assets uploaded yet) and prints
the `*.pages.dev` URL.

## Deploying the site

Wrangler reads the same token via env var. From the repo root:

```bash
export CLOUDFLARE_API_TOKEN=...          # same token as Terraform
export CLOUDFLARE_ACCOUNT_ID=...         # same account id as Terraform

npx wrangler@latest pages deploy src \
  --project-name=sodigames \
  --branch=master
```

That uploads everything under `src/` (the landing page + all four games).
Wrangler prints the deployment URL when finished — both
`https://sodigames.pages.dev` and a per-deploy `https://<hash>.sodigames.pages.dev`.

Re-run the `wrangler pages deploy` command any time you change the site. No
Terraform changes needed for content updates.

## Updating infra

Anything you change in `infra/*.tf` (e.g., adding a custom domain, renaming the
project) takes effect with:

```bash
cd infra
terraform apply
```

To attach a custom domain, set `custom_domain` in `terraform.tfvars` and apply.
The domain's zone must already exist on the same Cloudflare account; you'll
also need to add the CNAME shown in the Cloudflare dashboard (or manage it via
Terraform — outside the scope of this minimal setup).

## Teardown

```bash
cd infra
terraform destroy
```

This removes the Pages project and all deployments.

## Files

| File | Purpose |
| --- | --- |
| `main.tf` | Cloudflare provider + `cloudflare_pages_project` resource |
| `variables.tf` | Input variables (token, account id, project name, domain) |
| `outputs.tf` | Prints the `*.pages.dev` subdomain after apply |
| `terraform.tfvars.example` | Copy to `terraform.tfvars` and fill in |
