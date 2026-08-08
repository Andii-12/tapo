import Link from "next/link";
import { SiteCtaRow, SitePage, SiteSection } from "@/components/content/SitePage";

export default function HelpPage() {
  return (
    <SitePage
      eyebrow="✦ HELP ✦"
      title="Тусламж"
      lead="Уншлага, төлбөр, буцаан олголттой холбоотой түгээмэл асуултууд."
    >
      <SiteSection title="Хэрхэн уншлага хийх вэ?">
        <p>
          Уншлагын төрлөө сонгоод мэдээллээ оруулна. Дараа нь 72 хөзрөөс
          шаардлагатай тооны хөзөр сонгоно.
        </p>
      </SiteSection>
      <SiteSection title="Төлбөр">
        <p>
          3 болон 5 хөзрийн богино тайлбар үнэгүй байж болно. Дэлгэрэнгүй таро
          тайлан болон natal тайлан тус тусдаа төлбөртэй. Тийм/Үгүй уншлага бүрэн
          үнэгүй.
        </p>
      </SiteSection>
      <SiteSection title="Уншлагын дугаар">
        <p>
          Үр дүнгийн хуудсан дээрх дугаарыг хадгална уу. Дараа нь{" "}
          <Link href="/minii-unshlaga" className="underline">
            Миний уншлага
          </Link>{" "}
          хуудаснаас дахин үзэх боломжтой.
        </p>
      </SiteSection>
      <SiteSection title="Буцаан олголт">
        <p>
          Дэлгэрэнгүй дүрмийг{" "}
          <Link href="/butsaan-olgoltiin-bodlogo" className="underline">
            Буцаан олголтын бодлого
          </Link>
          -оос үзнэ үү.
        </p>
      </SiteSection>
      <SiteSection title="Холбоо барих">
        <p>
          <a href="mailto:hello@tarot.mn" className="underline">
            hello@tarot.mn
          </a>
        </p>
      </SiteSection>
      <SiteCtaRow
        links={[
          { href: "/bidnii-tuhai", label: "Бидний тухай" },
          { href: "/holboo-barih", label: "Холбоо барих" },
          { href: "/uilchluulegchdiin-setgegdel", label: "Сэтгэгдэл" },
        ]}
      />
    </SitePage>
  );
}
