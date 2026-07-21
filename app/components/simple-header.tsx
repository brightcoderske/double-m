import Image from "next/image";
import Link from "next/link";
export function SimpleHeader() {
  return (
    <header className="inner-header">
      <div className="shell nav-wrap">
        <Link href="/" className="brand">
          <Image
            src="/brand/logo.jpeg"
            width={52}
            height={52}
            alt="Double M Agency"
          />
          <span>
            <strong>DOUBLE M</strong>
            <small>AGENCY</small>
          </span>
        </Link>
        <nav>
          <Link href="/jobs">Find jobs</Link>
          <Link href="/hire">Hire staff</Link>
          <Link href="/">Home</Link>
        </nav>
      </div>
    </header>
  );
}
