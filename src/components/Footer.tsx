import React from "react";
import Link from "next/link";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Bagian Kiri */}
        <div className="footer-left">
          <img src="/Logo_icon.png" alt="Logo" className="footer-logo" />
          <p className="footer-text">
            Pengalaman belanja dimulai dari sini. LadangLokal hadir untuk
            memenuhi kebutuhan harian Anda dengan produk segar dan berkualitas
            dari sumber lokal. Mari dukung produk lokal bersama kami!
          </p>
          <Link href="/">
            <button className="footer-button">Belanja Sekarang</button>
          </Link>
        </div>

        {/* Bagian Tengah (Pemisah) */}
        <div className="footer-divider" />

        {/* Bagian Kanan */}
        <div className="footer-right text-left">
          <p>ladanglokal@contact.com</p>
          <p>Departemen Teknik Elektro dan Teknologi Informasi</p>
          <p>Fakultas Teknik - Universitas Gadjah Mada</p>
          <p>
            Jl. Grafika No.2, Senolowo, Sinduhadi, Kec. Mlati, Kabupaten Sleman,
            Daerah Istimewa Yogyakarta
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>©2024, Kelompok 12 all rights reserved</p>
        <div className="footer-social">
          <Link href="https://facebook.com">
            <img
              src="/footer/facebook.png"
              alt="Facebook"
              className="social-icon"
            />
          </Link>
          <Link href="https://linkedin.com">
            <img
              src="/footer/linkedin.png"
              alt="LinkedIn"
              className="social-icon"
            />
          </Link>
          <Link href="https://instagram.com">
            <img
              src="/footer/instagram.png"
              alt="Instagram"
              className="social-icon"
            />
          </Link>
          <Link href="https://twitter.com">
            <img
              src="/footer/twitter.png"
              alt="Twitter"
              className="social-icon"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
