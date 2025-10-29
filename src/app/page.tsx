export const metadata = {
  title: "Центр тканей — натуральные ткани для одежды и дома",
  description:
    "Широкий выбор натуральных тканей: лён, хлопок, трикотаж, сатин. Доставка по России. Скидки и новинки каждый день.",
  openGraph: {
    title: "Центр тканей — натуральные ткани для одежды и дома",
    description:
      "Широкий выбор натуральных тканей: лён, хлопок, трикотаж, сатин. Доставка по России.",
    url: "https://centertkani.ru/",
    siteName: "Центр тканей",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Центр тканей — натуральные ткани для одежды и дома",
    description:
      "Широкий выбор натуральных тканей: лён, хлопок, трикотаж, сатин. Доставка по России.",
  },
};
import HeroSlider from "@/components/home/HeroSlider";
import dynamic from "next/dynamic";
import NewArrivals from "@/components/home/NewArrivals";
const SaleBlock = dynamic(() => import("@/components/home/SaleBlock"), { ssr: true });
const Combinations = dynamic(() => import("@/components/home/Combinations"), { ssr: true });
const ShopInfo = dynamic(() => import("@/components/home/ShopInfo"), { ssr: true });
const PromoBlock = dynamic(() => import("@/components/home/PromoBlock"), { ssr: true });
const AboutSection = dynamic(() => import("@/components/home/AboutSection"), { ssr: true });

export default function HomePage() {
  return (
    <>
      {/* Organization JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Центр тканей",
            url: "https://centertkani.ru/",
            sameAs: [
              "https://t.me/centertkani",
              "https://wa.me/",
            ],
          }),
        }}
      />
      <HeroSlider />
      <NewArrivals />
      <SaleBlock />
      <Combinations />
      <ShopInfo />
      <PromoBlock />
      <AboutSection />
    </>
  );
}

