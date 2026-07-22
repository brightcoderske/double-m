"use client";
import { type MouseEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Home,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!(event.target as Element).closest(".mobile-quick"))
        document
          .querySelectorAll<HTMLDetailsElement>(".mobile-quick details[open]")
          .forEach((item) => (item.open = false));
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  const closeQuick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.closest("details")?.removeAttribute("open");
  };
  return (
    <header
      className={`site-header ${scrolled ? "is-scrolled" : ""} ${open ? "menu-open" : ""}`}
    >
      <div className="shell nav-wrap">
        <Link href="/" className="brand" aria-label="Double M Agency home">
          <Image
            src="/brand/logo.jpeg"
            width={52}
            height={52}
            priority
            alt="Double M Agency"
          />
          <span>
            <strong>DOUBLE M</strong>
            <small>AGENCY</small>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <div className="nav-group">
            <Link href="/services">Services</Link>
            <div className="nav-dropdown">
              <Link href="/services#home-care">Home & care staffing</Link>
              <Link href="/services#business">Business staffing</Link>
              <Link href="/services#recruitment">Recruitment support</Link>
            </div>
          </div>
          <Link href="/jobs">Find jobs</Link>
          <div className="nav-group">
            <Link href="/about">About us</Link>
            <div className="nav-dropdown">
              <Link href="/about">Our story</Link>
              <Link href="/about/founder">Founder</Link>
              <Link href="/testimonials">Testimonials</Link>
              <Link href="/faqs">FAQs</Link>
            </div>
          </div>
          <Link href="/blog">Resources</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="nav-actions">
          <Link
            className="header-search"
            href="/search"
            aria-label="Search jobs and articles"
          >
            <Search />
          </Link>
          <div className="mobile-quick">
            <Link href="/" aria-label="Home">
              <Home />
            </Link>
            <details>
              <summary>
                Services <ChevronDown />
              </summary>
              <div>
                <Link onClick={closeQuick} href="/services">
                  All services
                </Link>
                <Link onClick={closeQuick} href="/hire">
                  Request staff
                </Link>
                <Link onClick={closeQuick} href="/jobs">
                  Find jobs
                </Link>
              </div>
            </details>
            <details>
              <summary aria-label="Account">
                <UserRound />
                <ChevronDown />
              </summary>
              <div>
                <Link onClick={closeQuick} href="/login">
                  Sign in
                </Link>
                <Link onClick={closeQuick} href="/register/employer">
                  Employer account
                </Link>
                <Link onClick={closeQuick} href="/register">
                  Job seeker account
                </Link>
              </div>
            </details>
          </div>
          <Link className="text-link" href="/login">
            Sign in
          </Link>
          <Link className="button small" href="/hire">
            Request staff <ArrowRight size={16} />
          </Link>
          <button
            className="menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu" aria-label="Mobile navigation">
          <Link onClick={() => setOpen(false)} href="/">
            Home
          </Link>
          <details>
            <summary>
              Services <ChevronDown />
            </summary>
            <div>
              <Link onClick={() => setOpen(false)} href="/services">
                All services
              </Link>
              <Link onClick={() => setOpen(false)} href="/services#home-care">
                Home & care staffing
              </Link>
              <Link onClick={() => setOpen(false)} href="/services#business">
                Business staffing
              </Link>
              <Link onClick={() => setOpen(false)} href="/hire">
                Request staff
              </Link>
            </div>
          </details>
          <Link onClick={() => setOpen(false)} href="/jobs">
            Find jobs
          </Link>
          <details>
            <summary>
              About us <ChevronDown />
            </summary>
            <div>
              <Link onClick={() => setOpen(false)} href="/about">
                Our story
              </Link>
              <Link onClick={() => setOpen(false)} href="/about/founder">
                Founder
              </Link>
              <Link onClick={() => setOpen(false)} href="/testimonials">
                Testimonials
              </Link>
              <Link onClick={() => setOpen(false)} href="/faqs">
                FAQs
              </Link>
            </div>
          </details>
          <details>
            <summary>
              Resources <ChevronDown />
            </summary>
            <div>
              <Link onClick={() => setOpen(false)} href="/blog">
                Articles
              </Link>
              <Link onClick={() => setOpen(false)} href="/search">
                Search jobs & articles
              </Link>
            </div>
          </details>
          <Link onClick={() => setOpen(false)} href="/contact">
            Contact
          </Link>
          <div className="mobile-menu-actions">
            <Link onClick={() => setOpen(false)} href="/login">
              Sign in
            </Link>
            <Link onClick={() => setOpen(false)} href="/hire">
              Request staff
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
