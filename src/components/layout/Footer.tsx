import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border bg-bg-white/80 backdrop-blur-sm">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border"
      />
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-serif text-2xl tracking-[0.12em]">
            <span className="text-ink-soft" aria-hidden>
              ✦{" "}
            </span>
            TARO
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            Асуултынхаа хариуг ол
          </p>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.2em] text-ink-soft">ҮЙЛЧИЛГЭЭ</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-ink-muted">
            <Link href="/3-hozort" className="hover:text-ink">
              3 хөзөр
            </Link>
            <Link href="/5-hozort" className="hover:text-ink">
              5 хөзөр
            </Link>
            <Link href="/tiim-ugui" className="hover:text-ink">
              Тийм / Үгүй
            </Link>
            <Link href="/natal" className="hover:text-ink">
              Natal
            </Link>
            <Link href="/buh-hozruud" className="hover:text-ink">
              Бүх хөзөр
            </Link>
          </div>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.2em] text-ink-soft">КОМПАНИ</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-ink-muted">
            <Link href="/bidnii-tuhai" className="hover:text-ink">
              Бидний тухай
            </Link>
            <Link href="/uilchluulegchdiin-setgegdel" className="hover:text-ink">
              Үйлчлүүлэгчдийн сэтгэгдэл
            </Link>
            <Link href="/holboo-barih" className="hover:text-ink">
              Холбоо барих
            </Link>
            <Link href="/tuslamj" className="hover:text-ink">
              Тусламж
            </Link>
          </div>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.2em] text-ink-soft">БОДЛОГО</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-ink-muted">
            <Link href="/uilchilgeenii-nuhtsul" className="hover:text-ink">
              Үйлчилгээний нөхцөл
            </Link>
            <Link href="/nuutslalyn-bodlogo" className="hover:text-ink">
              Нууцлалын бодлого
            </Link>
            <Link href="/butsaan-olgoltiin-bodlogo" className="hover:text-ink">
              Буцаан олголтын бодлого
            </Link>
            <a href="mailto:hello@tarot.mn" className="hover:text-ink">
              hello@tarot.mn
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="container-page py-4 text-center text-xs text-ink-soft">
          Энэхүү үйлчилгээ нь зөвхөн зугаа цэнгэл, өөрийгөө эргэцүүлэх зориулалттай.
        </p>
      </div>
    </footer>
  );
}
