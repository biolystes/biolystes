import { motion } from "framer-motion";
import { Users2, Mail, UserCheck, Plus, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const mockTeam = [
  {
    id: "1",
    name: "Admin Principal",
    email: "admin@biolystes.com",
    role: "ADMIN",
    joinedAt: "2024-01-01",
    avatar: "A",
  },
  {
    id: "2",
    name: "Marie Éditrice",
    email: "marie@biolystes.com",
    role: "EDITOR",
    joinedAt: "2024-01-15",
    avatar: "M",
  },
  {
    id: "3",
    name: "Jean Lecteur",
    email: "jean@biolystes.com",
    role: "VIEWER",
    joinedAt: "2024-02-01",
    avatar: "J",
  },
];

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  EDITOR: "bg-blue-100 text-blue-700",
  VIEWER: "bg-muted text-muted-foreground",
};

const roleLabels: Record<string, string> = {
  ADMIN: "Administrateur",
  EDITOR: "Éditeur",
  VIEWER: "Lecteur",
};

export default function TeamPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl krona font-bold">Équipe</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez les membres de votre équipe
          </p>
        </div>
        <Button onClick={() => toast({ title: "Invitation envoyée" })}>
          <Plus className="h-4 w-4 mr-2" />
          Inviter un membre
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {mockTeam.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card className="clean-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{member.name}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {member.email}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[member.role]}`}>
                    {roleLabels[member.role]}
                  </span>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Depuis le {new Date(member.joinedAt).toLocaleDateString("fr-FR")}
                  </p>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
