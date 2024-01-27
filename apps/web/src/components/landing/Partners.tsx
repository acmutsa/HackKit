import { FaArrowAltCircleRight } from "react-icons/fa";
import Link from "next/link";
import TeamPerson from "./TeamMember";
import { createPerson,Person } from "./Team";
export default function Partners() {
  let p: Person = createPerson(
    "Calvin",
    "Jessen",
    `Logistics/Pr/Photographer`,
    "https://www.linkedin.com/in/calvin-j-39547a24b/",
    "",
    ""
  );

  return (
    <section className="bg-[#3D5A30] min-h-screen w-full flex flex-col gap-y-36 items-center justify-center">
    <h1 className="text-6xl font-bold font-oswald italic text-[#7D9037] text-center">
				MORE HERE SOON!
			</h1> 
    </section>
  );
}
