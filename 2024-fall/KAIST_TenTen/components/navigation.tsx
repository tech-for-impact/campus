import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/patients">Patients</Link>
        </li>
        <li>
          <Link href="/upload-recording">Recording</Link>
        </li>
      </ul>
    </nav>
  );
}
