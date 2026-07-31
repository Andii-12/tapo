import { SiteBulletList, SiteCtaRow, SitePage, SiteSection } from "@/components/content/SitePage";

export default function PrivacyPage() {
  return (
    <SitePage
      eyebrow="✦ PRIVACY ✦"
      title="Нууцлалын бодлого"
      lead="Бид таны хувийн мэдээллийг хүндэтгэж, зөвхөн үйлчилгээ үзүүлэхэд шаардлагатай хэмжээгээр цуглуулна."
    >
      <SiteSection title="Бид юу цуглуулах вэ?">
        <SiteBulletList
          items={[
            "Нэр, нас/төрсөн огноо, хүйс, и-мэйл",
            "Асуулт болон сонгосон хөзөр / уншлагын үр дүн",
            "Natal захиалгын төрсөн огноо, цаг (оруулсан бол)",
            "Төлбөрийн гүйлгээний төлөв, захиалгын дугаар",
            "Техникийн үндсэн лог (аюулгүй байдал, алдаа засах)",
          ]}
        />
      </SiteSection>

      <SiteSection title="Юунд ашиглах вэ?">
        <SiteBulletList
          items={[
            "Таро / natal тайлан бэлтгэх, харуулах",
            "Төлбөр баталгаажуулах",
            "PDF татах, и-мэйлээр хүргэх",
            "Дэмжлэг үзүүлэх, давхар төлбөр/алдаа шийдвэрлэх",
          ]}
        />
      </SiteSection>

      <SiteSection title="Хуваалцах">
        <p>
          Бид мэдээллийг зарж борлуулахгүй. Төлбөрийн үйлчилгээ үзүүлэгчид
          зөвхөн гүйлгээнд шаардлагатай мэдээллийг дамжуулна. Хуулийн
          шаардлагаар эрх бүхий байгууллагаас хүсэлт ирвэл заавал дагаж
          мөрдөнө.
        </p>
      </SiteSection>

      <SiteSection title="Хадгалалт ба устгал">
        <p>
          Уншлага, захиалгын мэдээллийг үйлчилгээ үзүүлэх, дахин үзэхэд
          шаардлагатай хугацаанд хадгална. Та и-мэйлээр холбогдон устгах
          хүсэлт гаргаж болно — хуулийн шаардлагаар хадгалах ёстой бичлэгээс
          бусад тохиолдолд боломжийн хугацаанд шийдвэрлэнэ.
        </p>
      </SiteSection>

      <SiteSection title="Холбоо барих">
        <p>
          Нууцлалтай холбоотой асуултыг{" "}
          <a href="mailto:hello@tarot.mn" className="underline">
            hello@tarot.mn
          </a>{" "}
          хаяг руу илгээнэ үү.
        </p>
      </SiteSection>

      <SiteCtaRow
        links={[
          { href: "/uilchilgeenii-nuhtsul", label: "Үйлчилгээний нөхцөл" },
          { href: "/butsaan-olgoltiin-bodlogo", label: "Буцаан олголт" },
          { href: "/holboo-barih", label: "Холбоо барих" },
        ]}
      />
    </SitePage>
  );
}
