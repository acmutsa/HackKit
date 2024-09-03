import Image from "next/image"

type Person = {
  fname: string
  lname: string
  imgLink: string
  role: string
  linkedin: string
  website: string
  github: string
}

function createPerson(
  fname: string,
  lname: string,
  role: string,
  linkedin?: string,
  website?: string,
  github?: string
): Person {
  return {
    fname,
    lname,
    imgLink: `/img/people/${fname.toLowerCase()}.png`,
    role,
    linkedin: linkedin || '',
    website: website || '',
    github: github || '',
  }
}

const team: Person[] = [
  createPerson("Trenton", "Ward", "Co-Lead Director"),
  createPerson("Saharsh", "Goenka", "Co-Lead Director"),
  createPerson("Kartik", "Aggarwal", "Director of Finance"),
  createPerson("Yonatan", "Rosenbloom", "Director of Industry"),
  createPerson("Omkaar", "Shenoy", "Director of Hacker Experience"),
  createPerson("Dhravya", "Shah", "Director of Technology"),
  createPerson("Satya", "Neriyanuru", "Director of Design & Marketing"),
  createPerson("Keerthana", "Gontu", "Director of Operations"),
  createPerson("Bhoomi", "Sahajsinghani", "Design and Marketing"),
  createPerson("Dhanush", "Kalaiselvan", "Tech"),
  createPerson("Paul", "Horton", "Associate"),
  createPerson("Edmund", "Dong", "Associate"),
  createPerson("Cecilia", "La Place", "Associate"),
]

export function MeetTheTeam() {
  return (
    <section className={`bg-gradient-to-b from-[#FEFBD9] to-[#FFF4B8] py-16`}>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#4B0082]">
          Meet the sunhacks team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="relative h-64">
                <Image 
                  src={member.imgLink}
                  alt={`${member.fname} ${member.lname}`}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4B0082] to-transparent opacity-30"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#483D8B] mb-1">{`${member.fname} ${member.lname}`}</h3>
                <p className="text-[#6A5ACD] font-medium">{member.role}</p>
                <div className="mt-4 flex space-x-4">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#4B0082] hover:text-[#6A5ACD]">
                      LinkedIn
                    </a>
                  )}
                  {member.website && (
                    <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-[#4B0082] hover:text-[#6A5ACD]">
                      Website
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-[#4B0082] hover:text-[#6A5ACD]">
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}