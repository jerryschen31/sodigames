variable "cloudflare_api_token" {
  description = "Cloudflare API token with Pages:Edit + Account:Read permissions."
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID (find in the Cloudflare dashboard sidebar)."
  type        = string
}

variable "project_name" {
  description = "Cloudflare Pages project name. Becomes <name>.pages.dev."
  type        = string
  default     = "sodigames"
}

variable "production_branch" {
  description = "Branch name treated as production for direct uploads."
  type        = string
  default     = "master"
}

variable "custom_domain" {
  description = "Optional custom domain to attach to the Pages project (leave blank to skip)."
  type        = string
  default     = ""
}
