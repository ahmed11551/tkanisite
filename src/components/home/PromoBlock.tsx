import Link from "next/link";

export default function PromoBlock() {
  return (
    <section className="py-8">
      <div className="container-custom">
        <div className="relative isolate rounded-2xl bg-white p-10 shadow-sm">
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Широкий выбор высококачественных текстильных материалов со скидками до 50%
            </h2>
            <Link href="/sale" className="btn-primary px-8 py-3">
              Перейти в каталог
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

