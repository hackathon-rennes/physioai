# Design réseau Azure — PhysioAI

La sécurité est vitale. Tous les services PaaS doivent rejeter le trafic public.

## VNet Principal
- CIDR : 10.0.0.0/16

## Subnets
| Subnet | CIDR | Usage |
|--------|------|-------|
| snet-aca | 10.0.1.0/24 | Container Apps Environment (Delegated) |
| snet-db | 10.0.2.0/24 | PostgreSQL Flexible Server (Delegated) |
| snet-pe | 10.0.4.0/24 | Private Endpoints (Key Vault, Storage, OpenAI) |

## Private Endpoints (PE)
- Azure OpenAI → PE → `snet-pe`
- Azure Key Vault → PE → `snet-pe`
- Blob Storage → PE → `snet-pe`

## Sécurité du trafic entrant
1. Azure Front Door (WAF activé pour filtrer les attaques Web).
2. Seules les adresses IP sortantes d'Azure Front Door peuvent atteindre le sous-réseau `snet-aca`.
