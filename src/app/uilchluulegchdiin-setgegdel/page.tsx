"use client";

import { SitePage } from "@/components/content/SitePage";
import { TestimonialsBoard } from "@/components/testimonials/TestimonialsBoard";

export default function TestimonialsPage() {
  return (
    <SitePage
      eyebrow="✦ REVIEWS ✦"
      title="Үйлчлүүлэгчдийн сэтгэгдэл"
      lead="Манай уншлага, natal тайланг туршсан хэрэглэгчдийн сэтгэгдэл. Та ч мөн бичиж болно."
    >
      <TestimonialsBoard showForm />
    </SitePage>
  );
}
