
--- Pembagian Role---
1. Hanifah Putri Ariani sebagai QA Tester: menyusun user requirement, menganalisis fitur yang dibutuhkan dan acceptable criteria, menjalankan End-to-End testing fitur aplikasi secara manual, menyusun API test (black box testing). 
2. Pijarwidyanara Andhita Hermawan sebagai Frontend Developer: membuat program di sisi frontend, membuat dan menjalankan unit test (white box testing)
3. Gabriel Syailendra Fernandez sebagai Backend Developer: membuat program di sisi backend, membuat dan menjalankan unit test (white box testing)

--- Penjelasan Fitur & Acceptence criteria ---
1. Fitur 1: Form Pencatatan Barang Masuk
a. Penjelasan Fitur:
Petugas gudang harus dapat dengan mudah mengisi formulir untuk mencatat barang masuk ke gudang, termasuk informasi seperti nama barang, jumlah, dan waktu masuk.
b. Acceptance Criteria:
- Petugas dapat mengisi nama barang, jumlah barang, dan tanggal masuk.
- Semua field harus muncul dengan label yang jelas.
- Form dapat disubmit tanpa error jika semua field valid.
- Setelah disubmit, data tercatat dan muncul di daftar barang masuk.
- Halaman tidak mengalami reload saat form disubmit.
2. Fitur 2: Validasi Input
a. Penjelasan Fitur:
- Untuk mencegah kesalahan pencatatan, sistem perlu mengecek apakah input valid (misalnya nama tidak kosong, jumlah adalah angka positif).
b. Acceptance Criteria:
- Jika nama barang kosong, muncul pesan error "Nama barang wajib diisi."
- Jika jumlah bukan angka positif, muncul pesan error "Jumlah harus lebih dari 0."
- Form tidak dapat disubmit sebelum semua validasi terpenuhi.
- Validasi dilakukan secara real-time atau sebelum data dikirim ke backend.
3. Fitur 3: Tampilan Daftar Barang Masuk
a. Penjelasan Fitur:
- Petugas dapat melihat daftar barang yang sudah berhasil dicatat, sebagai bentuk konfirmasi dan pelacakan stok terkini.
b. Acceptance Criteria:
- Daftar barang masuk ditampilkan dalam tabel atau list.
- Data mencakup minimal: nama barang, jumlah, dan tanggal masuk.
- Data terbaru muncul paling atas (urut berdasarkan waktu).
- Jika tidak ada data, muncul pesan "Belum ada barang masuk."
4. Fitur 4: Persistensi Data di Backend
a. Penjelasan Fitur:
- Data barang masuk harus disimpan di database, agar tidak hilang walaupun halaman di-refresh atau aplikasi dimuat ulang.
b. Acceptance Criteria:
- Setelah form dikirim, data disimpan di database (bisa dicek lewat endpoint atau Postman).
- Jika aplikasi dimuat ulang, data tetap muncul di daftar barang masuk.
- Endpoint /items atau sejenisnya mengembalikan data yang telah disimpan.

--- Screenshot hasil API Test ---
https://drive.google.com/drive/folders/1BEdekOiXvSRLYRp8WJV4cFRy6LhNr-N8?usp=sharing
--- Screenshot coverage unit test ---
https://drive.google.com/drive/folders/13dxQW2D6921eFOECvLerw1K3VLVkI1Cv?usp=sharing
--- link presentasi ---
https://docs.google.com/presentation/d/1SN291-nk5IqrRMQx39AqPEzLPJLfPs3m/edit?usp=sharing&ouid=110043330794961736421&rtpof=true&sd=true
