export const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
});

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatSeriesDate(input: string) {
  return input.slice(0, 10);
}

export function getChartLabel(input: string) {
  return shortDateFormatter.format(
    new Date(`${formatSeriesDate(input)}T00:00:00`),
  );
}

export function getTooltipDateLabel(input: string) {
  return longDateFormatter.format(
    new Date(`${formatSeriesDate(input)}T00:00:00`),
  );
}
