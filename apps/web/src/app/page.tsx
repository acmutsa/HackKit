import Navbar from '@/components/shared/Navbar';

import MLHBadge from '@/components/landing/MLHBadge';

import Parallax from './parallax';

export default function Home() {
  return (
    <div className={`w-full overflow-x-hidden `}>
      <MLHBadge />
      <main className="min-h-screen relative">
        <section className="relative bg-yellow-200/60 overflow-hidden">
          <Parallax />
          <div className="flex flex-col items-center justify-center min-h-screen w-full py-12 relative z-20 -translate-y-44">
            <img
              src="/logo.png"
              alt="Sunhacks logo"
              className="w-32 h-32 invert"
            />
            <h1 className="text-8xl font-bold text-center">
              sunhacks<span className="text-2xl"> 6.0</span>
            </h1>
            <h2 className="text-lg text-center mt-4 text-slate-700">
              Coming Fall 2024 at{' '}
              <a
                href="https://asu.edu"
                className="font-bold text-black underline"
              >
                Arizona State University
              </a>
            </h2>
            <div className="flex flex-col gap-2 items-center justify-center">
              <button className="text-lg text-white text-center mt-4 bg-black hover:bg-white hover:text-black py-2 px-4 rounded-md">
                Apply by 09/09!
              </button>
              <button className="underline">Become a volunteer</button>
            </div>
          </div>
        </section>
        <section className="flex flex-col bg-[#2F0007] min-h-screen z-50 items-center justify-center gap-8 px-8 md:px-0 py-8">
          <h2 className="text-white text-7xl">what is sunhacks?</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="text-white flex flex-col gap-4">
              <img
                className="md:w-[350px] rounded-xl"
                src="https://sunhacks.io/assets/showcase1.jpg"
              />
            </div>
            <div className="text-amber-400 md:w-1/2 text-2xl">
              sunhacks is a yearly hackathon (ideathon, coding marathon,
              prototyping marathon, etc) designed to support students in their
              innovative journeys. sunhacks is for students of all skill levels,
              and our job as organizers is to support you by providing the
              resources you need to achieve your development dreams. We provide
              you with workshops, mentors, community connections, and peers who
              are motivated to help each other succeed and reach their goals.
            </div>
          </div>
        </section>
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#2F0007"
                fillOpacity={1}
                d="M0,96L80,112C160,128,320,160,480,160C640,160,800,128,960,112C1120,96,1280,96,1360,96L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
              />
            </svg>
          </div>
          <section className="flex flex-col bg-[#D74E1D] min-h-screen z-50 items-center justify-center gap-8 px-8 md:px-0 py-8">
            <div>
              <h2 className="text-white text-7xl">And we're back for 2024!</h2>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-white flex flex-col gap-4">
                <img
                  className="md:w-[350px] rounded-xl"
                  src="https://sunhacks.io/assets/showcase1.jpg"
                />
              </div>
              <div className="text-amber-400 md:w-1/2 text-2xl">
                sunhacks is a yearly hackathon (ideathon, coding marathon,
                prototyping marathon, etc) designed to support students in their
                innovative journeys. sunhacks is for students of all skill
                levels, and our job as organizers is to support you by providing
                the resources you need to achieve your development dreams. We
                provide you with workshops, mentors, community connections, and
                peers who are motivated to help each other succeed and reach
                their goals.
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export const runtime = 'edge';
export const revalidate = '30';
