/* data.js — SEMUA isi yang boleh David ubah ada di file ini.
 *
 * Tanggal memakai format 'YYYY-MM-DD'. Zona waktu: Asia/Jakarta.
 * Item dengan `sample: true` akan diberi label "Contoh" di layar — hapus
 * baris itu (atau ubah jadi false) setelah kamu mengisi dengan cerita asli.
 *
 * PENTING (Our Future): website statis TIDAK bisa mengunci isi surat dengan
 * aman. "Terkunci" hanya tampilan berdasarkan tanggal; isi surat tetap ada di
 * file ini dan bisa dibaca siapa saja yang membuka source/DevTools.
 * Jangan taruh rahasia yang benar-benar penting di surat masa depan.
 */
window.MyLove = window.MyLove || {};
window.MyLove.data = {
  couple: { creator: 'David', partner: 'Rahmah Amalia', partnerShort: 'Rahmah' },
  site: { name: 'MY LOVE', tagline: 'A Universe That Exists Because of You.' },
  timezone: 'Asia/Jakarta',
  dates: { relationship: '2026-04-19', birthday: '2003-06-01' },

  welcome: {
    lines: [
      'Aku tidak bisa memberimu bintang sungguhan.',
      'Jadi aku membuatkan satu alam semesta kecil — hanya untukmu.',
      'Selamat datang, Rahmah. Semua yang bersinar di sini ada karena kamu.'
    ],
    sign: '— David'
  },

  // Taruh file lagu di assets/audio/. Jika file belum ada, player menampilkan pesan, tidak error.
  music: [
    { title: 'Lagu Kita', src: 'assets/audio/our-song.mp3' }
  ],

  story: [
    { date: '2026-04-19', title: 'Awal Cerita Kita',
      text: 'Pada tanggal inilah cerita kita resmi dimulai.',
      image: 'assets/images/story-01.jpg' },
    { date: null, title: 'Pertemuan pertama (contoh)', sample: true,
      text: 'Ceritakan di sini bagaimana kalian pertama kali bertemu. Ganti teks ini di data.js.',
      image: 'assets/images/story-02.jpg' },
    { date: null, title: 'Momen yang berkesan (contoh)', sample: true,
      text: 'Tulis momen yang benar-benar terjadi pada kalian berdua.',
      image: 'assets/images/story-03.jpg' },
    { date: null, title: 'Kenangan favorit (contoh)', sample: true,
      text: 'Tambahkan atau hapus peristiwa sesukamu — timeline menyesuaikan otomatis.',
      image: 'assets/images/story-04.jpg' }
  ],

  letters: [
    { id: 'miss', kicker: 'Open When You Miss Me', title: 'Saat Kamu Merindukanku',
      hint: 'Buka kapan pun rindu datang',
      text: 'Rahmah sayang,\n\nKalau kamu sedang membaca ini, berarti rindu sedang mampir. Tarik napas pelan-pelan. Aku juga sedang merindukanmu, dari tempat yang jaraknya hanya sejauh satu pesan.\n\nRindu bukan tanda ada yang kurang. Ia tanda bahwa ada seseorang yang berarti sekali. Dan kamu, bagiku, berarti sekali.\n\nPeluk dirimu dulu dariku. Nanti, kalau kita bertemu, giliranku memelukmu lebih lama.\n\nDengan seluruh rasa,\nDavid' },
    { id: 'sad', kicker: "Open When You're Sad", title: 'Saat Kamu Sedih',
      hint: 'Untuk hari yang terasa berat',
      text: 'Rahmah,\n\nAku tidak tahu apa yang membuat harimu berat, tapi aku ingin kamu tahu satu hal: kamu tidak harus kuat sendirian. Boleh menangis, boleh diam, boleh bilang "aku capek".\n\nSedihmu tidak membuatmu kurang berharga. Kamu tetap seseorang yang aku sayangi, di hari cerah maupun mendung.\n\nMinum air dulu, ya. Duduk sebentar. Lalu kabari aku kapan pun kamu siap — aku akan mendengarkan.\n\nAku di sini.\nDavid' },
    { id: 'hug', kicker: 'Open When You Need a Hug', title: 'Saat Kamu Butuh Pelukan',
      hint: 'Pelukan yang dikirim lewat kata',
      text: 'Rahmah,\n\nAnggap saja ini pelukan yang dikirim lewat kata-kata. Bayangkan aku di depanmu, kedua tangan terbuka, tidak terburu-buru.\n\nTutup matamu sebentar. Rasakan bahumu turun pelan-pelan. Kamu aman, kamu disayang, dan kamu tidak sendirian.\n\nPelukan yang sebenarnya menunggumu. Sampai saat itu, simpan yang ini dulu.\n\nPeluk erat,\nDavid' },
    { id: 'anniv', kicker: 'Open on Our Anniversary', title: 'Pada Hari Jadi Kita',
      hint: 'Disarankan dibuka setiap 19 April',
      text: 'Rahmah,\n\nSetiap 19 April, aku ingin mengingat hari ketika cerita kita dimulai. Terima kasih sudah memilih berjalan bersamaku.\n\nAku tidak menjanjikan semuanya akan selalu mudah. Tapi aku menjanjikan satu hal: aku akan terus memilihmu, di hari biasa maupun di hari istimewa.\n\nSelamat hari jadi, sayang.\nDavid' },
    { id: 'bday', kicker: 'Open on Your Birthday', title: 'Pada Hari Ulang Tahunmu',
      hint: 'Disarankan dibuka setiap 1 Juni',
      text: 'Selamat ulang tahun, Rahmah!\n\nHari ini, 1 Juni, dunia mendapat seseorang yang membuatnya sedikit lebih hangat. Aku bersyukur bisa berada di dunia yang sama denganmu.\n\nSemoga umurmu penuh sehat, tawa, dan hal-hal baik. Semoga mimpi-mimpimu satu per satu menemukan jalannya. Dan semoga, di setiap langkah itu, aku boleh ada di sampingmu.\n\nDengan sayang,\nDavid' }
  ],

  // type: 'photo' | 'video'. Taruh file di assets/images atau assets/videos.
  memories: [
    { id: 'p1', type: 'photo', src: 'assets/images/foto1.jpeg', caption: 'Kenangan kita', date: null },
    { id: 'p2', type: 'photo', src: 'assets/images/foto2.jpeg', caption: 'Kenangan kita', date: null },
    { id: 'p3', type: 'photo', src: 'assets/images/foto3.jpeg', caption: 'Kenangan kita', date: null },
    { id: 'p4', type: 'photo', src: 'assets/images/foto4.jpeg', caption: 'Kenangan kita', date: null },
    { id: 'p5', type: 'photo', src: 'assets/images/foto5.jpeg', caption: 'Kenangan kita', date: null },
    { id: 'p6', type: 'photo', src: 'assets/images/foto6.jpeg', caption: 'Kenangan kita', date: null },
    { id: 'p7', type: 'photo', src: 'assets/images/foto7.JPG', caption: 'Kenangan kita', date: null },
    { id: 'p8', type: 'photo', src: 'assets/images/foto8.jpeg', caption: 'Kenangan kita', date: null },
    { id: 'p9', type: 'photo', src: 'assets/images/foto9.jpeg', caption: 'Kenangan kita', date: null },
    { id: 'p10', type: 'photo', src: 'assets/images/foto10.jpeg', caption: 'Kenangan kita', date: null },
    { id: 'p11', type: 'photo', src: 'assets/images/foto11.jpeg', caption: 'Kenangan kita', date: null },
    { id: 'p12', type: 'photo', src: 'assets/images/foto12.jpeg', caption: 'Kenangan kita', date: null },
    { id: 'p13', type: 'photo', src: 'assets/images/foto13.jpeg', caption: 'Kenangan kita', date: null },
    { id: 'p14', type: 'photo', src: 'assets/images/foto15.jpeg', caption: 'Kenangan kita', date: null },
    { id: 'v1', type: 'video', src: 'assets/videos/video1.MP4', caption: 'Video kita', date: null }
  ],

  // Alasan ke-N = urutan ke-N (hari ke-N). Kosongkan ('') untuk melewati hari. Tambah sampai 365.
  reasons: [
    'Karena senyummu membuat hari yang berat terasa lebih ringan.',
    'Karena kamu mendengarkan dengan sungguh-sungguh.',
    'Karena bersamamu, diam pun terasa nyaman.',
    'Karena kamu apa adanya, dan itu sudah lebih dari cukup.',
    'Karena tawamu menular.',
    'Karena kamu membuatku ingin menjadi versi diriku yang lebih baik.',
    'Karena kamu sabar, bahkan ketika aku belum tentu pantas disabari.',
    'Karena namamu, Rahmah, berarti kasih sayang — dan kamu memang begitu.',
    'Karena kamu peduli pada hal-hal kecil.',
    'Karena bersamamu, aku merasa pulang.',
    'Karena kamu berani bermimpi.',
    'Karena kamu tetap lembut meski dunia kadang keras.',
    'Karena kamu membuatku percaya bahwa hal baik itu nyata.',
    'Karena caramu menyambut pagi.',
    'Karena kamu bisa membuatku tertawa di hari terburuk sekalipun.',
    'Karena ada ketulusan di setiap kata-katamu.',
    'Karena kamu menghargai proses, bukan hanya hasil.',
    'Karena kamu membuat hal biasa terasa istimewa.',
    'Karena aku merasa aman menjadi diriku sendiri di dekatmu.',
    'Karena kamu selalu punya ruang untuk orang lain.',
    'Karena doa-doamu yang diam-diam menguatkan.',
    'Karena kamu membuat masa depan terasa menyenangkan untuk dibayangkan.',
    'Karena kamu mau bertumbuh bersamaku.',
    'Karena kamu jujur, bahkan ketika itu sulit.',
    'Karena kamu memaafkan dengan hati yang lapang.',
    'Karena kamu tidak pernah membuatku merasa kecil.',
    'Karena bersamamu, waktu berjalan terlalu cepat.',
    'Karena kamu mengingatkanku untuk beristirahat.',
    'Karena kamu membuat yang sederhana terasa cukup.',
    'Karena kamu hadir sepenuhnya saat bersamaku.',
    'Karena caramu menyayangi tenang tapi dalam.',
    'Karena kamu membuatku bersyukur atas hal-hal kecil.',
    'Karena kamu kuat, dan tidak perlu membuktikannya pada siapa pun.',
    'Karena kamu tempat paling nyaman untuk bercerita.',
    'Karena kamu menjadikan 19 April tanggal favoritku.',
    'Karena kamu lahir pada 1 Juni, dan dunia jadi lebih baik sejak hari itu.',
    'Karena aku ingin menulis alasan ke-365 bersamamu, bukan sendirian.'
  ],

  // Koordinat x,y: 0 sampai 1 (posisi di peta bintang).
  universe: {
    david: { x: 0.27, y: 0.6,
      message: 'Aku David. Ini bintangku, dan kutaruh di dekatmu. Dari semua tempat di alam semesta, aku paling suka berada di dekat bintang Rahmah.' },
    rahmah: { x: 0.7, y: 0.4,
      message: 'Ini bintangmu, Rahmah. Cahayanya tidak perlu dibuat-buat; ia sudah terang. Alam semesta ini ada karena kamu.' },
    stars: [
      { id: 'doa', title: 'Bintang Doa', x: 0.14, y: 0.26, message: 'Setiap malam aku berdoa supaya kamu selalu sehat, tenang, dan bahagia.' },
      { id: 'tawa', title: 'Bintang Tawa', x: 0.46, y: 0.17, message: 'Tawamu suara favoritku. Kalau suatu hari kamu lupa betapa indahnya, mampirlah ke sini.' },
      { id: 'rumah', title: 'Bintang Rumah', x: 0.88, y: 0.64, message: 'Rumah bukan hanya tempat. Kadang, rumah adalah seseorang. Bagiku, itu kamu.' },
      { id: 'sabar', title: 'Bintang Sabar', x: 0.57, y: 0.8, message: 'Terima kasih sudah sabar. Aku sedang belajar menjadi seseorang yang pantas untuk kesabaranmu.' },
      { id: 'harap', title: 'Bintang Harapan', x: 0.34, y: 0.87, message: 'Aku punya banyak harapan, dan hampir semuanya ada namamu.' },
      { id: 'janji', title: 'Bintang Janji', x: 0.89, y: 0.2, message: 'Aku tidak berjanji hidup kita selalu mudah. Aku berjanji akan terus berusaha, bersamamu.' }
    ]
  },

  future: {
    letters: [
      { title: 'Surat di Awal Cerita', unlock: '2026-04-19',
        text: 'Rahmah,\n\nIni surat pertama yang kutulis untuk masa depan kita. Aku belum tahu semua yang akan terjadi, tapi aku tahu aku ingin menjalaninya bersamamu.\n\nDavid' },
      { title: 'Untuk Tahun Baru 2027', unlock: '2027-01-01',
        text: 'Rahmah,\n\nSelamat tahun baru. Semoga tahun ini lebih ramah padamu, dan semoga kita saling menjaga di setiap bagiannya.\n\nDavid' },
      { title: 'Untuk Hari Jadi Pertama Kita', unlock: '2027-04-19',
        text: 'Rahmah,\n\nSatu tahun. Terima kasih sudah tinggal. Aku masih memilihmu, dan akan terus begitu.\n\nDavid' },
      { title: 'Untuk Ulang Tahunmu ke-24', unlock: '2027-06-01',
        text: 'Selamat ulang tahun, Rahmah.\n\nSemoga hari ini selembut yang kamu pantas dapatkan. Aku bersyukur untuk setiap tahun yang bisa kulihat kamu tumbuh.\n\nDavid' }
    ],
    dreams: [
      { title: 'Mimpi kita berdua', kicker: 'MIMPI', text: 'Membangun masa depan bersama, memiliki rumah yang nyaman, keluarga kecil yang bahagia, dan kehidupan yang selalu kita syukuri.' },
      { title: 'Perjalanan bersama', kicker: 'TUJUAN', text: 'Saling mendukung impian, mengembangkan diri, membangun karier, traveling bersama, dan melewati setiap proses kehidupan sebagai pasangan.' },
      { title: 'Masa depan kita', kicker: 'HARAPAN', text: 'Menjadi pasangan yang tetap saling memilih, membangun keluarga penuh cinta, menjaga kepercayaan, dan menua bersama hingga akhir perjalanan.' }
    ]
  }
};
