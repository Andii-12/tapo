import { SiteBulletList, SiteCtaRow, SitePage, SiteSection } from "@/components/content/SitePage";

export default function AboutPage() {
  return (
    <SitePage
      eyebrow="✦ ABOUT ✦"
      title="Бидний тухай"
      lead="ТАРО нь монгол хэлээр таро уншлага, төрсөн зурхайн (natal) тайланг энгийн, цэгцтэй хэлбэрээр хүргэх зорилготой платформ."
    >
      <SiteSection title="Бид юу хийдэг вэ?">
        <p>
          Хэрэглэгч асуултаа оруулж, хөзөр сонгоод өөрт тохирсон тайлбарыг
          авна. 3 хөзөр, 5 хөзөр, Тийм/Үгүй уншлагаас гадна төрсөн огноонд
          суурилсан natal тайланг тусад нь санал болгоно.
        </p>
      </SiteSection>

      <SiteSection title="Бидний зарчим">
        <SiteBulletList
          items={[
            "Зугаа цэнгэл, өөрийгөө эргэцүүлэх зориулалт — мэргэжлийн эмнэлэг, хууль, санхүүгийн зөвлөгөө биш.",
            "Англи + монгол хоёр хэлээр ойлгомжтой тайлбар.",
            "Таро болон natal тус тусдаа бүтээгдэхүүн, тус тусдаа төлбөр.",
            "Хувийн мэдээллийг зөвхөн үйлчилгээ үзүүлэхэд ашиглах.",
          ]}
        />
      </SiteSection>

      <SiteSection title="Хэнд зориулагдсан бэ?">
        <p>
          Амьдралын сонголт, харилцаа, ажил төрөл, ерөнхий чиглэлийн талаар
          бодож буй, тайван орчинд эргэцүүлэл хийхийг хүссэн хэн бүхэнд
          нээлттэй.
        </p>
      </SiteSection>

      <SiteCtaRow
        links={[
          { href: "/#unshlaga", label: "Уншлага эхлүүлэх" },
          { href: "/uilchluulegchdiin-setgegdel", label: "Сэтгэгдэл" },
          { href: "/holboo-barih", label: "Холбоо барих" },
        ]}
      />
    </SitePage>
  );
}
