output "project_name" {
  value       = cloudflare_pages_project.sodigames.name
  description = "Cloudflare Pages project name."
}

output "subdomain" {
  value       = cloudflare_pages_project.sodigames.subdomain
  description = "The default *.pages.dev URL."
}
