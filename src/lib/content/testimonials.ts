export type TestimonialSentiment = "good" | "bad";

export type StaticTestimonial = {
  slug: string;
  name: string;
  meta: string;
  tag: string;
  quote: string;
  sentiment: TestimonialSentiment;
};

/** Seeded into DB once; keep exactly 3. */
export const STATIC_TESTIMONIALS: StaticTestimonial[] = [
  {
    slug: "static-saraa",
    name: "Сараа",
    meta: "5 хөзрийн уншлага",
    tag: "КАРЬЕР",
    quote:
      "Ажил солих эсэхээ эргэлзэж байхад 5 хөзрийн тайлбар маш цэгцтэй, практик зөвлөгөө өгсөн. Илүү тайван шийдвэр гаргасан.",
    sentiment: "good",
  },
  {
    slug: "static-baterdene",
    name: "Бат-Эрдэнэ",
    meta: "3 хөзөр + Natal",
    tag: "ӨӨРИЙГӨӨ МЭДЭХ",
    quote:
      "Натал тайлан болон таро хоёулаа тусдаа байгаа нь сайн. Англи, монгол хоёуланг нь зэрэгцүүлж уншсан.",
    sentiment: "good",
  },
  {
    slug: "static-nomin",
    name: "Номин",
    meta: "Тийм / Үгүй",
    tag: "ХУРДАН ХАРИУ",
    quote:
      "Богино асуултад шууд хариу авч, дараа нь дэлгэрэнгүй уншлага руу орсон. Хялбар, ойлгомжтой.",
    sentiment: "good",
  },
];

export type TestimonialStatus = "approved" | "pending" | "hidden";

export type TestimonialView = {
  id: string;
  slug: string;
  name: string;
  quote: string;
  meta: string;
  tag: string;
  sentiment: TestimonialSentiment;
  status?: TestimonialStatus;
  isStatic: boolean;
  createdAt?: string;
};
