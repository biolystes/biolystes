import { useState } from "react";
import { motion } from "framer-motion";
import { Users2, Mail, CheckCircle, XCircle, Download, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockLeads } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

export default function LeadsPage() {
  const [leads, setLeads] = useState(mockLeads);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const filtered = leads.filter(
    (l) =>
      l.firstName.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.agentName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    toast({ title: "Lead supprimé" });
  };

  const handleExport = () => {
    toast({ title: "Export CSV en cours..." });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl krona font-bold">Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {leads.length} lead{leads.length > 1 ? "s" : ""} collecté{leads.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Exporter CSV
        </Button>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Rechercher un lead..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="clean-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Prénom</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Agent</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Consentement</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Analyse</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                          {lead.firstName[0]}
                        </div>
                        <span className="text-sm font-medium">{lead.firstName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-secondary px-2 py-1 rounded-lg">
                        {lead.agentName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {lead.consent ? (
                        <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "#10B981" }}>
                          <CheckCircle className="h-3 w-3" /> Oui
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <XCircle className="h-3 w-3" /> Non
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {lead.analysisCompleted ? (
                        <Badge variant="outline" className="text-xs">Complète</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">En cours</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(lead.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Users2 className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground">Aucun lead trouvé</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
