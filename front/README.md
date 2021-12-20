## Comportement de base

- Cache par défaut, mais est considéré comme stale directement 
- Réactualise à chaque focus de la page
- Réactualise quand on récupère le réseau
- Refetch manuellement

Expliquer le staletime

Source : https://react-query.tanstack.com/guides/important-defaults#_top


### Chargement "à la main"

Il y a 2 approches

- `refetch()` avec `{enabled: false}` contrôle totalement le rechargement
- `{enabled: state}` réactive le comportement de base
