import React from "react";
import Link from "next/link";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Bagian Kiri */}
        <div className="footer-left">
          <img src="/Logo_icon.png" alt="Logo" className="footer-logo" />
          <p className="footer-text">
            Pengalaman belanja dimulai dari sini. LadangLokal hadir untuk
            memenuhi kebutuhan harian Anda dengan produk segar dan berkualitas dari sumber lokal. Mari dukung produk lokal bersama kami!
          </p>
          <button className="footer-button">Shop now</button>
        </div>

        {/* Bagian Tengah (Pemisah) */}
        <div className="footer-divider" />

        {/* Bagian Kanan */}
        <div className="footer-right text-left">
          <p>ladanglokal@contact.com</p>
          <p>Departemen Teknik Elektro dan Teknologi Informasi</p>
          <p>Fakultas Teknik - Universitas Gadjah Mada</p>
          <p>Jl. Grafika No.2, Senolowo, Sinduhadi, Kec. Mlati, Kabupaten Sleman, Daerah Istimewa Yogyakarta</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2022, All rights reserved</p>
        <div className="footer-social">
          <Link href="https://facebook.com"><img src="/icons/facebook-icon.png" alt="Facebook" className="social-icon" /></Link>
          <Link href="https://linkedin.com"><img src="/icons/linkedin-icon.png" alt="LinkedIn" className="social-icon" /></Link>
          <Link href="https://instagram.com"><img src="/icons/instagram-icon.png" alt="Instagram" className="social-icon" /></Link>
          <Link href="https://twitter.com"><img src="/icons/twitter-icon.png" alt="Twitter" className="social-icon" /></Link>
        </div>
      </div>
    </footer>
  );
}
