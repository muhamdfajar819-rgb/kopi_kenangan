// Ganti nama menu & harga sesuai kedai Anda.
const menu = [
  {
    nama: "Espresso",
    kategori: "Kopi",
    ket: "Shot kopi pekat dari biji arabika pilihan.",
    harga: 15000,
  },
  {
    nama: "Kopi Susu Kenangan",
    kategori: "Kopi",
    ket: "Kopi susu gula aren, menu andalan kami.",
    harga: 22000,
  },
  {
    nama: "Cappuccino",
    kategori: "Kopi",
    ket: "Espresso, susu, dan busa lembut.",
    harga: 25000,
  },
  {
    nama: "Americano",
    kategori: "Kopi",
    ket: "Espresso dengan air panas, ringan dan bersih.",
    harga: 18000,
  },
  {
    nama: "Matcha Latte",
    kategori: "Non-Kopi",
    ket: "Teh hijau Jepang dengan susu segar.",
    harga: 26000,
  },
  {
    nama: "Cokelat Hangat",
    kategori: "Non-Kopi",
    ket: "Cokelat pekat yang menghangatkan.",
    harga: 23000,
  },
  {
    nama: "Croissant Mentega",
    kategori: "Camilan",
    ket: "Renyah di luar, lembut di dalam.",
    harga: 20000,
  },
  {
    nama: "Pisang Goreng Keju",
    kategori: "Camilan",
    ket: "Pisang goreng dengan parutan keju.",
    harga: 17000,
  },
];

const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");
const list = document.getElementById("menu-list");
const filters = document.getElementById("filters");
const kategori = ["Semua", "Kopi", "Non-Kopi", "Camilan"];

function render(k) {
  const data = k === "Semua" ? menu : menu.filter((m) => m.kategori === k);
  list.innerHTML = data
    .map(
      (m) => `
    <article class="card">
      <span class="cat">${m.kategori}</span>
      <h3>${m.nama}</h3>
      <p>${m.ket}</p>
      <div class="price">${rupiah(m.harga)}</div>
    </article>`,
    )
    .join("");
}

kategori.forEach((k, i) => {
  const b = document.createElement("button");
  b.textContent = k;
  if (i === 0) b.classList.add("active");
  b.onclick = () => {
    filters
      .querySelectorAll("button")
      .forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    render(k);
  };
  filters.appendChild(b);
});
render("Semua");

const form = document.getElementById("order-form");
const msg = document.getElementById("form-msg");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  msg.className = "msg err";
  if (!d.nama.trim() || !d.whatsapp.trim() || !d.email.trim() || !d.alamat.trim())
    return (msg.textContent = "Mohon isi semua kolom.");
  if (!/^(\+62|62|0)8\d{7,12}$/.test(d.whatsapp.replace(/[\s-]/g, "")))
    return (msg.textContent = "Nomor WhatsApp tidak valid.");
  if (!/^\S+@\S+\.\S+$/.test(d.email))
    return (msg.textContent = "Email tidak valid.");
  msg.className = "msg";
  msg.textContent = `mengirim pesanan....`;
  try {
    const res = await fetch("/pesan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(d),
    });
    if (!res.ok) throw new Error("Gagal mengirim pesanan.");
    msg.className = "msg success";
    msg.textContent = "Pesanan berhasil dikirim!";
    msg.style.display = "block";
    setTimeout(() => {
      msg.style.display = "none";
    }, 5000);
    form.reset();
  } catch (err) {
    msg.className = "msg err";
    msg.textContent = err.message;
  }
});
document.getElementById("year").textContent = new Date().getFullYear();
