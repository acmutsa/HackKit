import Balancer from "react-wrap-balancer";
import Image from "next/image";
import D1 from "../../../public/img/landing/d1.svg";
import D2 from "../../../public/img/landing/d2.svg"
import D3 from "../../../public/img/landing/d3.svg";
import D4 from "../../../public/img/landing/d4.svg";
import Dino_Coding from "../../../public/img/landing/dinos_coding.png"
export default function About() {
  const d1_stylesheet = {
    width:'25rem',
    height: "auto",
    sm:"width: 30rem" 
  };
  return (
    <section
      className="flex w-full items-center justify-center min-h-screen"
      id="About">
      <div >
        <h1 className=" text-4xl md:text-5xl font-black text-center">About Section Can Go Here</h1>
      </div>
    </section>
  );
}
