import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS_FR = ["DIM.", "LUN.", "MAR.", "MER.", "JEU.", "VEN.", "SAM."];

interface BookingCalendarProps {
  calendarMonth: Date;
  onMonthChange: (d: Date) => void;
  selectedDate: Date | null;
  onSelectDate: (d: Date) => void;
  interactive: boolean;
}

export const BookingCalendar = ({
  calendarMonth, onMonthChange, selectedDate, onSelectDate, interactive,
}: BookingCalendarProps) => {
  const monthLabel = calendarMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();

  const isPast = (day: number) => {
    const d = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return d < today;
  };
  const isToday = (day: number) => {
    const now = new Date();
    return calendarMonth.getFullYear() === now.getFullYear() && calendarMonth.getMonth() === now.getMonth() && day === now.getDate();
  };
  const isSelected = (day: number) =>
    selectedDate?.getDate() === day &&
    selectedDate?.getMonth() === calendarMonth.getMonth() &&
    selectedDate?.getFullYear() === calendarMonth.getFullYear();

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-5">
        <span className="text-foreground text-base font-medium capitalize">{monthLabel}</span>
        <div className="flex gap-1">
          <button
            onClick={() => interactive && onMonthChange(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${interactive ? "text-foreground/70 hover:text-foreground hover:bg-foreground/5 active:scale-95" : "text-foreground/20 cursor-default"}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => interactive && onMonthChange(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${interactive ? "text-foreground/70 hover:text-foreground hover:bg-foreground/5 active:scale-95" : "text-foreground/20 cursor-default"}`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS_FR.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold tracking-wider text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Présentation type Cal.com (JP, 02/09/2026) : grandes cases grises,
          le jour choisi passe en noir, les jours passés restent visibles
          mais inactifs. */}
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const disabled = !interactive || isPast(day);
          const selected = interactive && isSelected(day);

          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() => {
                if (!interactive) return;
                onSelectDate(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day));
              }}
              className={`flex aspect-square w-full items-center justify-center rounded-xl text-sm transition-all
                ${disabled
                  ? "bg-transparent text-foreground/15 cursor-default"
                  : selected
                    ? "bg-foreground text-background font-semibold"
                    : "bg-foreground/5 text-foreground/80 hover:bg-foreground/10 active:scale-95"
                }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {!interactive && (
        <div className="mt-6 text-center">
          <div className="inline-block bg-foreground/5 rounded-2xl px-5 py-3">
            <p className="text-sm text-muted-foreground">Merci de remplir le formulaire avant de choisir votre créneau horaire.</p>
          </div>
        </div>
      )}
    </div>
  );
};
