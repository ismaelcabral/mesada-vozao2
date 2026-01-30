import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Classification } from "@/types/mesada";
import { ClassificationBadge } from "@/components/cards/ClassificationBadge";

interface MesadaBreakdownStats {
  baseValue: number;
  yellowCards: number;
  redCards: number;
  goals: number;
  doubleGoals: number;
  totalPenalty: number;
  totalBonus: number;
  finalValue: number;
  classification: Classification;
  isRescueWeek: boolean;
}

interface MesadaBreakdownProps {
  stats: MesadaBreakdownStats;
  showClassification?: boolean;
}

export function MesadaBreakdown({ stats, showClassification = true }: MesadaBreakdownProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💰 Cálculo da Mesada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Valor Base</span>
              <span className="font-bold">R$ {stats.baseValue.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-green-600">+ Gols ({stats.goals + stats.doubleGoals})</span>
              <span className="font-bold text-green-600">+R$ {stats.totalBonus.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-yellow-600">- Amarelos ({stats.yellowCards})</span>
              <span className="font-bold text-yellow-600">-R$ {(stats.yellowCards * 5).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-red-600">- Vermelhos ({stats.redCards})</span>
              <span className="font-bold text-red-600">-R$ {(stats.redCards * 15).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 bg-primary/10 rounded-lg px-3 mt-4">
              <span className="font-bold text-lg">TOTAL</span>
              <span className="font-bold text-2xl text-primary">R$ {stats.finalValue.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {showClassification && (
        <ClassificationBadge classification={stats.classification} showAnimation />
      )}

      {stats.isRescueWeek && (
        <Card className="border-orange-300 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔄</span>
              <div>
                <h4 className="font-bold text-orange-800">Semana de Repescagem!</h4>
                <p className="text-sm text-orange-700">
                  É a última semana do mês. Oportunidade de recuperar divisão ou valor!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
