const paths = {
  home: "M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  building: "M4 21V3h12v18M16 9h4v12M8 7h4M8 11h4M8 15h4M2 21h20",
  briefcase: "M8 6V4h8v2M3 7h18v13H3ZM3 12q9 5 18 0M10 13h4",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M17 4a4 4 0 0 1 0 7M22 21v-2a4 4 0 0 0-3-3.87",
  chart: "M4 20V12M10 20V4M16 20V8M22 20H2",
  shield: "m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6ZM8 12l3 3 5-6",
  search: "M21 21l-5-5M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  bookmark: "M6 3h12v19l-6-4-6 4Z",
  chevron: "m9 5 7 7-7 7",
  down: "m6 9 6 6 6-6",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  back: "M19 12H5m5-5-5 5 5 5",
  close: "m6 6 12 12M6 18 18 6",
  filter: "M3 5h18l-7 8v7l-4-2v-5Z",
  columns: "M3 4h18v16H3ZM9 4v16M15 4v16",
  download: "M12 3v12m-5-5 5 5 5-5M3 17v4h18v-4",
  check: "m5 12 4 4L19 6",
  info: "M12 11v6M12 7h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20",
  alert: "m12 3 10 18H2ZM12 9v5m0 3h.01",
  clock: "M12 8v5l3 2M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20",
  file: "M14 2H5v20h14V7ZM14 2v5h5M8 12h8M8 16h8",
  copy: "M9 3h12v14H9ZM5 7H3v14h12v-2",
  star: "m12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1Z",
  menu: "M3 6h18M3 12h18M3 18h18",
  dots: "M5 12h.01M12 12h.01M19 12h.01",
  refresh: "M20 7a9 9 0 1 0 1 9M20 2v6h-6",
  sort: "m8 3-4 4h8M8 3v18m8 0 4-4h-8M16 3v18",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  lock: "M5 10h14v12H5ZM8 10V6a4 4 0 0 1 8 0v4",
  target:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10M12 11v2",
  settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2",
  printer: "M6 8V2h12v6M6 17H3V8h18v9h-3M6 14h12v8H6Z",
};
export function icon(name, cls = "") {
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.file}"/></svg>`;
}
