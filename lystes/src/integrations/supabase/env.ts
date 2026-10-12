/* Variables d’environnement de lystes.ai, figées ici : sur biolystes.com,
   import.meta.env désigne la base de biolystes.com, pas celle de lystes.ai.
   Clé publiable (servie à tout visiteur de lystes.ai), aucun secret. */
export const LYSTES_ENV = {
  VITE_SUPABASE_URL: "https://sjvxyiqiacpwskglgxkf.supabase.co",
  VITE_SUPABASE_PUBLISHABLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqdnh5aXFpYWNwd3NrZ2xneGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDk1NDYsImV4cCI6MjA4MTU4NTU0Nn0.YYsMIeJRpWBqgK6CobrRUE1NekFIyLX4I7b9bZMxvOk",
  VITE_SUPABASE_PROJECT_ID: "sjvxyiqiacpwskglgxkf",
} as const;
