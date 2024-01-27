import { FaArrowAltCircleRight } from "react-icons/fa";
import Link from "next/link";
import TeamPerson from "./TeamMember";
import { createPerson,Person } from "./Team";
export default function Partners() {

let p:Person = createPerson(
    "Christian",
    "Walker",
    'tech',
    "https://www.linkedin.com/in/christian-d-walker/",
    "",
    "https://github.com/christianhelp"
  )

	return (
		<section className="bg-[#3D5A30] min-h-screen w-full flex flex-col gap-y-36 items-center justify-center">
			{/* <h1 className="text-6xl font-bold font-oswald italic text-[#7D9037] text-center">
				MORE HERE SOON!
			</h1> */}
			<TeamPerson person={p}/>
			{/* <Link href="/register">
				<button className="bg-[#FEF2E6] text-lg text-[#3D5A30] font-mono font-bold px-5 py-2 rounded flex items-center gap-x-2">
					Register Now <FaArrowAltCircleRight />
				</button>
			</Link> */}
		</section>
	);
}
