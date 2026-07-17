import Navbar from "@/components/shared/Navbar";
import FAQClient from "./faq-client";
import Footer from "@/components/landing/Footer";
import LandingThread from "@/components/landing/LandingThread";
export default function FAQPage() {
  return (
    <>
   
    <div className="w-full overflow-x-hidden">
      <LandingThread />
      <Navbar />
      <FAQClient />
      <Footer/>
    </div>
    </>
  );
}