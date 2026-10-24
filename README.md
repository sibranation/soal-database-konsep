# Kuis Konsep Basis Data

15 soal pilihan ganda dari materi *Model Pembelajaran Berbasis Industri – Konsep Basis Data* (model data, model hierarkis/relasional/berorientasi objek, SQL).

## Jalankan

```bash
node server.js
```

Buka http://localhost:3000 → isi Nama & NIM → **Mulai** → jawab 15 soal → **Selesai** → skor tampil.

## Data (JSON lokal)

- `data/soal.json` — soal + kunci jawaban (kunci tidak dikirim ke browser)
- `data/hasil.json` — hasil tiap peserta (nama, NIM, benar, skor, waktu), dibuat otomatis saat jalan lokal

## Rekap hasil

Buka `/hasil` (tidak ada link dari halaman kuis). Auto-refresh tiap 10 detik, bisa cari, sort, unduh CSV.

Di Vercel, file JSON tidak bisa disimpan permanen, jadi hasil disimpan di Upstash Redis:
Vercel dashboard → project → Storage → tambah **Upstash for Redis** → connect ke project → redeploy.
Env `KV_REST_API_URL` / `KV_REST_API_TOKEN` otomatis terisi; tanpa env itu, hasil disimpan ke `data/hasil.json`.

Tes: `node test.js`
