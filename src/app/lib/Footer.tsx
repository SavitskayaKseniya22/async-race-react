import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between bg-slate-300 p-4 text-white">
      <Link href="https://rs.school/js/" target="_blank" title="Course's author">
        <Image src="/images/rs-school-js.svg" width={60} height={25} alt="Course's author's logo" />
      </Link>

      <Link href="https://github.com/SavitskayaKseniya22" target="_blank" title="Developer's github">
        made by Kseniia Savitskaia
      </Link>

      <span>© 2024</span>
    </footer>
  );
}
