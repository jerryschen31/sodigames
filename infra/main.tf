terraform {
  required_version = ">= 1.5.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.40"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

data "cloudflare_zone" "sodigames" {
  count = var.custom_domain == "" ? 0 : 1
  name  = var.custom_domain
}

resource "cloudflare_record" "root_cname" {
  count   = var.custom_domain == "" ? 0 : 1
  zone_id = data.cloudflare_zone.sodigames[0].id
  name    = "@"
  type    = "CNAME"
  content = cloudflare_pages_project.sodigames.subdomain
  proxied = true
}

resource "cloudflare_record" "www_cname" {
  count   = var.custom_domain == "" ? 0 : 1
  zone_id = data.cloudflare_zone.sodigames[0].id
  name    = "www"
  type    = "CNAME"
  content = cloudflare_pages_project.sodigames.subdomain
  proxied = true
}

resource "cloudflare_pages_domain" "root" {
  count        = var.custom_domain == "" ? 0 : 1
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.sodigames.name
  domain       = var.custom_domain
}

resource "cloudflare_pages_domain" "www" {
  count        = var.custom_domain == "" ? 0 : 1
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.sodigames.name
  domain       = "www.${var.custom_domain}"
}

resource "cloudflare_pages_project" "sodigames" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = var.production_branch

  deployment_configs {
    production {
      compatibility_date = "2025-01-01"
    }
    preview {
      compatibility_date = "2025-01-01"
    }
  }
}
