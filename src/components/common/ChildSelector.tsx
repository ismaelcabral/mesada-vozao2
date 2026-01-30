import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChildren, ChildInfo } from "@/hooks/useChildren";

interface ChildSelectorProps {
  value?: string;
  onValueChange: (childId: string, child: ChildInfo) => void;
  placeholder?: string;
}

export function ChildSelector({ value, onValueChange, placeholder = "Selecione o filho" }: ChildSelectorProps) {
  const { children, loading } = useChildren();

  if (loading) {
    return (
      <div className="h-10 flex items-center px-3 border rounded-md bg-muted/50 text-muted-foreground">
        Carregando filhos...
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="h-10 flex items-center px-3 border rounded-md bg-muted/50 text-muted-foreground text-sm">
        Nenhum filho vinculado. Peça para seu filho se registrar com seu ID de pai.
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={(id) => {
      const child = children.find(c => c.user_id === id);
      if (child) {
        onValueChange(id, child);
      }
    }}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {children.map((child) => (
          <SelectItem key={child.user_id} value={child.user_id}>
            ⚽ {child.athlete_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
