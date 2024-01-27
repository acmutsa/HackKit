import Balancer from "react-wrap-balancer";

export default function About() {
  return (
    <section
      className="relative z-10 min-h-screen w-full bg-[#603a17] bg-[url('/img/landing/About_background.svg')] bg-no-repeat bg-cover px-5 py-20"
      id="About">
      <div className="mx-auto max-w-6xl pt-20">
        {/* Div for all of the fossil background images. Would love to have these without the little ground affect around them */}

        <div className="w-full h-full">
          <img
            src="/img/landing/d1.svg"
            className="w-[25rem] sm:w-[30rem] md:w-[32rem] 2xl:w-[48rem] top-0 right-0 sm:left-1/3 md:left-0  absolute -z-[1]"
          />
          <img
            src="/img/landing/d2.svg"
            className="w-96 sm:w-[28rem] md:w-[30rem] 2xl:w-[40rem] left-0 top-1/4 sm:top-1/4 md:top-1/3 md:left-1/2 lg:top-[38%] lg:left-[63%] absolute -z-[1]"
          />
          <img
            src="/img/landing/d3.svg"
            className="w-[22rem] sm:w-[25rem] md:w-[28rem] 2xl:w-[32rem] right-0 top-[51rem] sm:top-[62%] md:top-[78%] md:right-60 lg:top-[36%] lg:left-6 2xl:top-[29rem] absolute -z-[1]"
          />
          <img
            src="/img/landing/d4.svg"
            className="w-72 sm:w-96 md:w-[28rem] 2xl:w-[35rem] bottom-0 left-0 sm:right-32 md:bottom-0 md:hidden lg:block lg:top-[80%] lg:left-1/4 2xl:top-[52rem] absolute -z-[1]"
          />
        </div>

        {/* Info columns */}
        <div className="grid grid-cols-1 gap-y-16 md:grid-cols-2">
          <div className="flex flex-col justify-center gap-y-6">
            <h1 className="font-oswald text-center text-5xl font-bold italic text-[#FEF2E6] md:text-left lg:text-6xl">
              ABOUT US
            </h1>
            <p className="text-center font-mono text-lg font-bold text-[#FEF2E6] md:text-left">
              <Balancer>
                RowdyHacks is a free, weekend-long, overnight hackathon hosted
                at UTSA! Students can join us to network, code, collaborate, and
                compete. We welcome hackers from all disciplines, backgrounds, &
                technical levels!
              </Balancer>
            </p>
          </div>
          {/* Placeholder for let's get rowdy alternative */}
          <img
            src="/img/landing/lil_man.png"
            className="mx-auto hidden md:block md:w-[200px] md:h[200px] lg:w-[250px] lg:h[250px] 2xl:w-[300px] 2xl:h[3000px]"
          />
          <div>
            <img
              src="/img/landing/dinos_coding.png"
              height={300}
              width={500}
              alt="Dinosaurs Coding Around A Table"
              className="mx-auto"
            />
          </div>
          <div className="pb-20 md:pb-0 flex flex-col justify-center gap-y-10">
            <h1 className="font-oswald text-center text-5xl font-bold italic text-[#FEF2E6] md:text-left lg:text-6xl">
              WHO CAN ATTEND?
            </h1>
            <p className="text-center font-mono text-lg font-bold text-[#FEF2E6] md:text-left">
              <Balancer>
                We're excited to welcome hackers from all disciplines,
                backgrounds, & technical levels! Whether you can't count the
                number of apps you've built, or you have never written a line of
                code before, RowdyHacks has something for everyone!
              </Balancer>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
