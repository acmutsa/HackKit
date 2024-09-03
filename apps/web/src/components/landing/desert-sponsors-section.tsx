'use client'

import { Alata } from 'next/font/google'
import { Sun } from 'lucide-react'
import partners from "@/components/landing/partners.json"

const alata = Alata({ subsets: ['latin'], weight: ['400'] })

export function DesertSponsorsSection() {
  return (
    <section className={`${alata.className} bg-gradient-to-b from-orange-100 to-yellow-50 text-brown-900 py-16 relative overflow-hidden`}>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          A Huge Thanks To Our Sunhacks Partners!
        </h2>
        
        <div className="space-y-12">
          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-semibold text-center text-orange-600">
              Planet Sponsors
            </h3>
            <div className="flex justify-center items-center space-x-8">
              {[1, 2].map((sponsor, index) => (
                <div key={index} className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-orange-200">
                  <Sun className="w-24 h-24 text-orange-400" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-semibold text-center text-yellow-600">
              Moon Sponsors
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {[1, 2, 3].map((sponsor, index) => (
                <div key={index} className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-yellow-200">
                  <Sun className="w-16 h-16 text-yellow-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle desert-themed background elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-yellow-100 rounded-tl-full rounded-tr-full opacity-50"></div>
      <div className="absolute top-10 left-10 w-16 h-16 bg-orange-200 rounded-full opacity-30"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-200 rounded-full opacity-40"></div>
    </section>
  )
}