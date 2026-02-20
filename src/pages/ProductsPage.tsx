import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Plus, Search, Pencil, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Produit supprimé" });
  };

  const categoryColors: Record<string, string> = {
    Skincare: "bg-pink-100 text-pink-700",
    Haircare: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl krona font-bold">Produits</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez votre catalogue de produits beauté
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un produit
        </Button>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="clean-card h-full">
                <CardContent className="p-5 space-y-3">
                  {/* Image placeholder */}
                  <div className="w-full h-32 bg-muted rounded-xl flex items-center justify-center">
                    <Package className="h-10 w-10 text-muted-foreground/30" />
                  </div>

                  {/* Badge */}
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      categoryColors[product.category] || "bg-muted text-muted-foreground"
                    }`}
                  >
                    {product.category}
                  </span>

                  {/* Name & price */}
                  <div>
                    <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
                    <p className="text-lg font-bold mt-1">{product.price.toFixed(2)} €</p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" size="sm" className="flex-1 rounded-lg text-xs h-8">
                      <Pencil className="h-3 w-3 mr-1" /> Éditer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg text-xs h-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card className="clean-card">
          <CardContent className="text-center py-16">
            <Package className="h-14 w-14 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Ajoutez vos premiers produits ou modifiez votre recherche
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
