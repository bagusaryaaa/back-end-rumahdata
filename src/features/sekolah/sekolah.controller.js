import { pool } from "../../config/db.js";

export const getSekolah = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // PERBAIKAN: Jangan gunakan SELECT *, pilih kolom esensial untuk list
    const dataQuery = `
      SELECT sekolah_id, nama, npsn, bentuk_pendidikan, kecamatan, kabupaten, provinsi, status_sekolah
      FROM public.data_sekolah
      ORDER BY sekolah_id
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) FROM public.data_sekolah
    `;

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, [limit, offset]),
      pool.query(countQuery),
    ]);

    const totalData = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalData / limit);

    res.json({
      page,
      limit,
      totalData,
      totalPages,
      data: dataResult.rows,
    });
  } catch (err) {
    console.error("SEKOLAH ERROR:", err);
    res.status(500).json({ message: "Gagal memproses data sekolah" });
  }
};

export const deleteAllSekolah = async (req, res) => {
  try {
    // PERBAIKAN: Hapus RESTART IDENTITY karena sekolah_id adalah TEXT
    await pool.query("TRUNCATE TABLE public.data_sekolah CASCADE");

    res.json({
      message: "Seluruh data sekolah telah berhasil dihapus",
    });
  } catch (err) {
    console.error("DELETE ALL SEKOLAH ERROR:", err);
    res.status(500).json({ message: "Gagal menghapus semua data sekolah" });
  }
};

export const searchSekolah = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.query || "";
    const offset = (page - 1) * limit;

    // PERBAIKAN: Spesifikkan kolom yang direturn
    const dataQuery = `
      SELECT sekolah_id, nama, npsn, bentuk_pendidikan, kecamatan, kabupaten, provinsi, status_sekolah
      FROM public.data_sekolah
      WHERE sekolah_id ILIKE $1 OR nama ILIKE $2
      ORDER BY nama ASC
      LIMIT $3 OFFSET $4
    `;

    const countQuery = `
      SELECT COUNT(*) FROM public.data_sekolah
      WHERE sekolah_id ILIKE $1 OR nama ILIKE $2
    `;

    // PERBAIKAN: Gunakan %search% untuk kedua parameter agar pencarian ID juga fleksibel
    const searchParam = `%${search}%`;
    const values = [searchParam, searchParam];

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, [...values, limit, offset]),
      pool.query(countQuery, values),
    ]);

    const totalData = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalData / limit);

    res.json({
      page,
      limit,
      totalData,
      totalPages,
      data: dataResult.rows,
    });
  } catch (err) {
    console.error("SEARCH SEKOLAH ERROR:", err);
    res.status(500).json({ message: "Gagal memproses pencarian data sekolah" });
  }
};

export const getSekolahDetail = async (req, res) => {
  // Fungsi ini SUDAH BAGUS dan aman karena sudah secara eksplisit
  // menembak kolom "nama, npsn, alamat_jalan, email".
  // Tidak ada perubahan besar yang diperlukan di sini.
  try {
    const { sekolah_id } = req.params;
    const search = req.query.query || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const sekolahQuery = `
      SELECT nama, npsn, alamat_jalan, email 
      FROM public.data_sekolah 
      WHERE LOWER(sekolah_id) = LOWER($1)
    `;
    const sekolahRes = await pool.query(sekolahQuery, [sekolah_id]);

    if (sekolahRes.rows.length === 0) {
      return res.status(404).json({ message: "Sekolah tidak ditemukan" });
    }

    const {
      nama: namaSekolah,
      npsn: npsnSekolah,
      alamat_jalan,
      email,
    } = sekolahRes.rows[0];

    const dataQuery = `
      SELECT ptk_id, nama, semester, nik, nip, jenis_ptk, status_kepegawaian, jabatan_ptk
      FROM public.ptk
      WHERE LOWER(sekolah_id) = LOWER($1) 
      AND (nama ILIKE $2)
      ORDER BY nama ASC
      LIMIT $3 OFFSET $4
    `;

    const countQuery = `
      SELECT COUNT(*) FROM public.ptk
      WHERE LOWER(sekolah_id) = LOWER($1)
      AND (nama ILIKE $2)
    `;

    const searchParam = `%${search}%`;
    const values = [sekolah_id, searchParam];

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, [...values, limit, offset]),
      pool.query(countQuery, values),
    ]);

    const totalData = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalData / limit);

    res.json({
      sekolah_terpilih: namaSekolah,
      alamat: alamat_jalan,
      email: email,
      npsn: npsnSekolah,
      sekolah_id: sekolah_id.toLowerCase(),
      totalData: totalData,
      totalPages: totalPages,
      page: page,
      limit: limit,
      data_ptk: dataResult.rows,
    });
  } catch (err) {
    console.error("GET PTK BY SEKOLAH ERROR:", err);
    res.status(500).json({ message: "Gagal memuat data" });
  }
};
