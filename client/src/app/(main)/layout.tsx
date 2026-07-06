import { Suspense } from "react";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar/index";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <main>{children}</main>
      <Footer />
    </>
  );
}
