// ── SHEETS.JS ──
// Membaca data produk langsung dari Google Sheets
// Ganti SHEET_ID dan API_KEY dengan milikmu

const SHEET_ID = "1cDQ3zHJK-Z1mUdWTPK9yigwgqJ91MGns0jnnFHfuCY4";
const API_KEY  = "AIzaSyBMne3Hh9QdXdXMWaji8V43u_zRqdmFdz0";

const KATEGORI_TABS = [
  "Buket Bunga",
  "Buket Boneka",
  "Buket Uang",
  "Buket Makanan",
  "Buket Thumbelina"
];

// Ambil data satu tab
async function fetchTab(namaTab) {
  const range = encodeURIComponent(`${namaTab}!A2:E`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gagal fetch tab: ${namaTab}`);
  const data = await res.json();
  const rows = data.values || [];
  return rows
    .filter(row => row[0] && row[1] && row[2]) // skip baris kosong
    .map(row => ({
      id       : row[0] || "",
      nama     : row[1] || "",
      harga    : parseInt(row[2]) || 0,
      foto     : row[3] || "",
      kategori : row[4] || namaTab  // fallback ke nama tab kalau kolom E kosong
    }));
}

// Ambil semua tab sekaligus
async function fetchSemuaProduk() {
  const hasilPerTab = await Promise.all(
    KATEGORI_TABS.map(tab => fetchTab(tab).catch(() => []))
  );
  return hasilPerTab.flat();
}
