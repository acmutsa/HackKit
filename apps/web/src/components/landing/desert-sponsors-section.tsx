'use client'

import { Alata } from 'next/font/google'
import { Sun } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const alata = Alata({ subsets: ['latin'], weight: ['400'] })

const tierSizes = {
  "Star": "w-96",
  "Planet": "w-72",
  "Moon": "w-60",
  "Comet": "w-48",
};

const partners = [{
  "name": "Devils invent",
  "logo": "devils-invent.png",
  "url": "https://students.engineering.asu.edu/devils-invent/",
  "tier":"Star"
},{
  "name": "Amazon",
  "logo": "amazon.svg",
  "url": "https://amazon.jobs",
  "tier": "Planet"
},{
      "name": "State Farm",
      "logo": "statefarm.png",
      "url": "https://www.statefarm.com/careers",
      "tier":"Moon"
    },{
      "name": "GDMS",
      "logo": "gdms.png",
      "url": "https://gdmissionsystems.com/careers",
      "tier":"Comet"
    }
    ]
  

export function DesertSponsorsSection() {
  return (
    <section className={`${alata.className} bg-gradient-to-b from-orange-100 to-yellow-50 text-brown-900 py-16 relative overflow-hidden`}>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          A Huge Thanks To Our Sunhacks Partners!
        </h2>
        
        <div className="space-y-12">
          <div className="space-y-6 flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center space-x-8">
              {partners?.map((sponsor, index) => (
                // <div key={index} className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-orange-200">
                  <Link className={`hover:scale-105`} href={sponsor.url}>
                    <Image className={`${tierSizes[sponsor.tier as keyof typeof tierSizes]}`} key={index} unoptimized width={20} height={20} alt={sponsor.name} src={!sponsor.logo.startsWith("http") ? `/img/partner-logos/${sponsor.logo}`: sponsor.logo}/>
                  </Link>
                // </div>
              ))}
            </div>
          </div>
          
          {/* <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-semibold text-center text-yellow-600">
              Moon Sponsors
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-6">
            {partners.filter(i => i.tier === "Moon")?.map((sponsor, index) => (
                <div key={index} className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-orange-200">
                  <Image width={200} height={200} alt={sponsor.name} src={!sponsor.logo.startsWith("http") ? `/img/partner-logos/${sponsor.logo}`: sponsor.logo}/>
                </div>
              ))}
            </div>
          </div>
        </div>
          <div className="space-y-6 scale-75">
            <h3 className="text-2xl md:text-3xl font-semibold text-center text-yellow-600">
              Star Sponsors
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-6">
            {partners.filter(i => i.tier === "Star")?.map((sponsor, index) => (
                // <div key={index} className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-orange-200">
                  <Image key={index} className='rounded-xl' unoptimized width={200} height={200} alt={sponsor.name} src={!sponsor.logo.startsWith("http") ? `/img/partner-logos/${sponsor.logo}`: sponsor.logo}/>
                // </div>
              ))}
            </div>
          </div> */}
          </div>
      </div>
      
      {/* Subtle desert-themed background elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-yellow-100 rounded-tl-full rounded-tr-full opacity-50"></div>
      <div className="absolute top-10 left-10 w-16 h-16 bg-orange-200 rounded-full opacity-30"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-200 rounded-full opacity-40"></div>
    </section>
  )
}