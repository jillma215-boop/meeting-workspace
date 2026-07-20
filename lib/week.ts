export type WeekOption = {
  weekYear: number;
  weekNumber: number;
  startDate: string;
  endDate: string;
  label?: '前週' | '今週';
};

const DAY_MS = 86400000;

export const toDateInput = (date: Date) => date.toISOString().slice(0, 10);
export const formatDisplayDate = (date: string) => date.replaceAll('-', '/');
export const formatWeekRange = (startDate: string, endDate: string) => `${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}`;

const utcDate = (date: Date) => new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

export function getIsoWeekInfo(input: Date | string): { weekYear: number; weekNumber: number } {
  const date = typeof input === 'string' ? new Date(`${input}T00:00:00`) : input;
  const target = utcDate(date);
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const weekYear = target.getUTCFullYear();
  const yearStart = new Date(Date.UTC(weekYear, 0, 1));
  const weekNumber = Math.ceil(((target.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7);
  return { weekYear, weekNumber };
}

export function getWeekStart(input: Date) {
  const date = new Date(input.getFullYear(), input.getMonth(), input.getDate());
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date;
}

export function makeWeekOption(start: Date, label?: WeekOption['label']): WeekOption {
  const weekStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const startDate = toDateInput(weekStart);
  const { weekYear, weekNumber } = getIsoWeekInfo(weekStart);
  return { weekYear, weekNumber, startDate, endDate: toDateInput(weekEnd), label };
}

export function getDefaultWeekOption(today = new Date()) {
  const currentStart = getWeekStart(today);
  const previousStart = new Date(currentStart);
  previousStart.setDate(currentStart.getDate() - 7);
  return makeWeekOption(previousStart, '前週');
}

export function getWeekOptions(today = new Date()): WeekOption[] {
  const currentStart = getWeekStart(today);
  const options: WeekOption[] = [makeWeekOption(currentStart, '今週')];
  for (let offset = 1; offset <= 8; offset += 1) {
    const start = new Date(currentStart);
    start.setDate(currentStart.getDate() - offset * 7);
    options.push(makeWeekOption(start, offset === 1 ? '前週' : undefined));
  }
  return options.sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export const sameWeek = (a: Pick<WeekOption, 'weekYear' | 'weekNumber'>, b: Pick<WeekOption, 'weekYear' | 'weekNumber'>) => a.weekYear === b.weekYear && a.weekNumber === b.weekNumber;
