export const defaultTheme = "light";

export default {
	hackathonName: "RowdyHacks",
	itteration: "IX",
	defaultMetaDataDescription:
		"RowdyHacks is a free, weekend-long, overnight hackathon hosted at UTSA! Students can join us to network, code, collaborate, and compete. We welcome hackers from all disciplines, backgrounds, & technical levels!",
	localUniversityName: "The University of Texas at San Antonio",
	localUniversityShortIDName: "ABC123",
	localUniversityShortIDMaxLength: 6,
	dietaryRestrictionOptions: [
		"Vegan",
		"Vegetarian",
		"Nuts",
		"Fish",
		"Wheat",
		"Dairy",
		"Eggs",
		"Halal",
	],
	groups: [
		"T-rex | Group A",
		"T-rex | Group B",
		"Triceratops | Group A",
		"Triceratops | Group B",
		"Pterodactyl | Group A",
		"Pterodactyl | Group B",
		"Alamosaurus | Group A",
		"Alamosaurus | Group B",
		"Stegosaurus | Group A",
		"Stegosaurus | Group B",
	],
	issueEmail: "team@rowdyhacks.org",
	links: {
		discord: "https://go.rowdyhacks.org/discord",
		instagram: "https://instagram.com/rowdyhacks",
		twitter: "https://twitter.com/rowdyhacks",
		facebook: "https://facebook.com/rowdyhacks",
		github: "https://github.com/acmutsa",
	},
	icon: {
		sm: "/img/logo/logo.png",
		md: "/img/logo/rh-md.png",
		lg: "/img/logo/rh-lg.png",
		svg: "/img/logo/logo.png",
	},
	dashPaths: {
		dash: {
			Overview: "/dash",
			"Event Pass": "/dash/pass",
			Schedule: "/dash/schedule",
			// Team: "/dash/team",
		},
		admin: {
			Overview: "/admin",
			Users: "/admin/users",
			Events: "/admin/events",
			Points: "/admin/points",
			"Check-in": "/admin/check-in",
			Toggles: "/admin/toggles",
		},
	},
	eventTypes: {
		Meal: "#FFC107",
		Workshop: "#10b981",
		Ceremony: "#9C27B0",
		Social: "#2196F3",
		Other: "#795548",
	},
	// TODO: Can remove days? Pretty sure they're dynamic now.
	days: {
		Saturday: new Date(2023, 6, 15),
		Sunday: new Date(2023, 6, 16),
	},
	maxResumeSizeInBytes: 4194304,
	maxFileSizeInBytes: 4194304,
	maxProfilePhotoSizeInBytes: 3145728,
	noResumeProvidedURL: "https://static.acmutsa.org/No%20Resume%20Provided.pdf",
	eventPassBgImage: "/img/dash/pass/bg.png",
	startDate: new Date(new Date(2024, 1, 25).setHours(9)),
	prettyLocation: "San Pedro I, UTSA",
	roleBadges: {
		hacker: {
			title: "Hacker",
			color: "hsl(var(--hackathon-primary))",
			foreground: "#ffffff",
			checked: false,
		},
		volunteer: {
			title: "Volunteer",
			color: "#4CAF50",
			foreground: "#ffffff",
			checked: false,
		},
		mentor: {
			title: "Mentor",
			color: "#9C27B0",
			foreground: "#ffffff",
			checked: false,
		},
		mlh: {
			title: "MLH",
			color: "#ffffff",
			foreground: "#E73426",
			checked: "#E73426",
		},
		admin: {
			title: "Organizer",
			color: "#f59e0b",
			foreground: "#ffffff",
			checked: true,
		},
		super_admin: {
			title: "Organizer",
			color: "#f59e0b",
			foreground: "#ffffff",
			checked: true,
		},
	},
	maxTeamSize: 4,
} as const;

// Its important that this is kept in sync with the database schema.

export const perms = ["hacker", "volunteer", "mentor", "mlh", "admin", "super_admin"] as const;

// These are routes (pages) which do not require a account / authentication. They are used in the authMiddleware in middleware.ts. Be careful which routes you add here!

export const publicRoutes = ["/", /^\/schedule(\/.*)?$/, /^\/@/, /^\/user\//, "/404", "/bugreport"];

// Generally it is reccomended to put your primary audience's university at the top of this list.

export const schools = [
	"The University of Texas at San Antonio",
	"American Heritage School",
	"American River College, California",
	"American University, Washington, D.C.",
	"Amherst College",
	"Anna University",
	"Arizona State University",
	"Aston University",
	"Atlanta Metropolitan State College",
	"Auburn University",
	"Austin College",
	"Austin Community College District",
	"Babson College",
	"Baruch College, CUNY",
	"Baylor University",
	"Bellevue College, Washington",
	"Benedictine College",
	"Binghamton University",
	"Birmingham City University",
	"Blinn College",
	"Bloomsburg University of Pennsylvania",
	"Boston College",
	"Boston University",
	"Bowie State University",
	"Brandeis University",
	"Brigham Young University",
	"Brock University",
	"Brooklyn College, CUNY",
	"Brown University",
	"Bucknell University",
	"COMSATS Institute of Information Technology",
	"Caldwell University",
	"California Institute of Technology",
	"California Polytechnic State University, San Luis Obispo",
	"California State Polytechnic University, Pomona",
	"California State University, Fresno",
	"California State University, Fullerton",
	"California State University, Long Beach",
	"California State University, Los Angeles",
	"California State University, Northridge",
	"California State University, Sacramento",
	"California State University, San Bernardino",
	"California State University, Bakersfield",
	"California State University, San Francisco",
	"California State University, Channel Islands",
	"California State University, Maritime",
	"California State University, San Jose",
	"California State University, Chico",
	"California State University, Monterey Bay",
	"California State University, San Luis Obispo",
	"California State University, Dominguez Hills",
	"California State University, San Marcos",
	"California State University, East Bay",
	"California State University, Sonoma",
	"California State University, Stanislaus",
	"California State University, Humboldt",
	"California State University, San Diego",
	"Carleton University",
	"Carnegie Mellon University",
	"Carthage College",
	"Cedarville University",
	"Central Texas College",
	"Clark University",
	"Clarkson University",
	"Clemson University",
	"Cleveland State University",
	"Collin College",
	"Colorado School of Mines",
	"Columbia University",
	"Columbus College of Art and Design",
	"Concordia University",
	"Connecticut College",
	"Cornell College",
	"Cornell University",
	"Dallas College",
	"Dartmouth College",
	"Dawson College",
	"DePaul University",
	"DePauw University",
	"DeSales University",
	"Denison University",
	"Drake University",
	"Drew University",
	"Drexel University",
	"Duke University",
	"Durham College",
	"Durham University",
	"East Central University",
	"Emory University",
	"Fairfield University",
	"Florida Atlantic University",
	"Florida Gulf Coast University",
	"Florida Institute Of Technology",
	"Florida International University",
	"Florida Polytechnic University",
	"Florida State University",
	"Fordham University",
	"Full Sail University",
	"Fullerton College",
	"George Heriot's School",
	"George Mason University",
	"Georgetown University",
	"Georgia Institute of Technology",
	"Georgia State University",
	"Grand Valley State University",
	"Hampshire College",
	"Hampton University",
	"Harper College",
	"Harvard Medical School",
	"Harvard University",
	"Howard University",
	"Illinois Institute of Technology",
	"Illinois State University",
	"Indiana University",
	"Indiana University of Pennsylvania",
	"Indiana University-Purdue University Fort Wayne",
	"Indiana University-Purdue University Indianapolis",
	"Iowa State University",
	"Ithaca College",
	"James Madison University",
	"Johns Hopkins University",
	"Kansas State University",
	"Kean University",
	"Keele University",
	"Kennesaw State University",
	"Kent State University",
	"Lafayette College",
	"Lamar University",
	"Lawrence University",
	"Lehigh University",
	"Leiden University",
	"Lewis & Clark College",
	"Lewis University",
	"Loughborough University",
	"Louisiana State University",
	"Macalester College",
	"Madison College",
	"Manhattan College",
	"Marquette University",
	"Marymount University",
	"Massachusetts Institute of Technology",
	"Miami University",
	"Michigan State University",
	"Michigan Technological University",
	"Middle Tennessee State University",
	"Middlebury College",
	"Middlesex University",
	"Milwaukee School of Engineering",
	"Mississippi State University",
	"Mississippi University for Women",
	"Missouri State University",
	"Montana State University",
	"Montclair State University",
	"Montgomery College",
	"Morgan State University",
	"New Jersey City University",
	"New Jersey Institute of Technology",
	"New York City College of Technology, CUNY",
	"New York Institute of Technology",
	"New York University",
	"Newcastle University",
	"North American University",
	"North Carolina School of Science and Mathematics",
	"North Carolina State University",
	"Northeastern University",
	"Northern Arizona University",
	"Northern Illinois University",
	"Northern Kentucky University",
	"Northern Michigan University",
	"Northwest Missouri State University",
	"Northwest Vista College",
	"Northwestern Oklahoma State University",
	"Northwestern University",
	"Nottingham Trent University",
	"Oakland University",
	"Oklahoma State University",
	"Oregon State University",
	"Parsons School of Design",
	"Pittsburgh Technical Institute",
	"Portland State University",
	"Princeton University",
	"Purdue University",
	"Queen's University",
	"Rhode Island College",
	"Rhode Island School of Design",
	"Rhodes College",
	"Rice University",
	"Richard Stockton University",
	"Richland College",
	"Rider University",
	"Rochester Institute of Technology",
	"Rutgers, The State University of New Jersey",
	"SUNY Polytechnic Institute",
	"San Diego State University",
	"San Francisco State University",
	"San Jose State University",
	"Santa Clara University",
	"Seneca College",
	"Simon Fraser University",
	"Smith College",
	"South Carolina State University",
	"South Dakota School of Mines and Technology",
	"Southeastern Louisiana University",
	"Southern Connecticut State University",
	"Southern Illinois University Carbondale",
	"Southern Illinois University Edwardsville",
	"Southern Methodist University",
	"St Edwards University",
	"St Paul's Catholic College - Sunbury-on-Thames",
	"St. Cloud State University",
	"St. John's University, New York",
	"St.Mary's Convent School",
	"Stanford University",
	"Stephen F. Austin State University",
	"Stetson University",
	"Stevens Institute of Technology",
	"Stevenson University",
	"Stockton University",
	"Stonehill College",
	"Stony Brook University, SUNY",
	"Swarthmore College",
	"Syracuse University",
	"Temple University",
	"Texas A&M University",
	"Texas A&M University - Central Texas",
	"Texas A&M University - Corpus Christi",
	"Texas A&M University - Kingsville",
	"Texas Christian University",
	"Texas Southern University",
	"Texas Southmost College",
	"Texas State University",
	"Texas Tech University",
	"The City College of New York, CUNY",
	"The George Washington University",
	"The Ohio State University",
	"The Pennsylvania State University",
	"The Pennsylvania State University - Abington Campus",
	"The Pennsylvania State University - Harrisburg",
	"The Pennsylvania State University - York Campus",
	"The Pennsylvania State University - Berks",
	"The University of Alabama",
	"The University of Arizona",
	"The University of Arkansas",
	"The University of Birmingham",
	"The University of Calgary",
	"The University of California, Berkeley",
	"The University of California, Davis",
	"The University of California, Irvine",
	"The University of California, Los Angeles",
	"The University of California, Riverside",
	"The University of California, San Diego",
	"The University of California, Santa Barbara",
	"The University of California, Merced",
	"The University of California, Santa Cruz",
	"The University of Cambridge",
	"The University of Central Florida",
	"The University of Cincinnati",
	"The University of Colorado Boulder",
	"The University of Colorado Colorado Springs",
	"The University of Connecticut",
	"The University of Dallas",
	"The University of Delaware",
	"The University of Denver",
	"The University of Derby",
	"The University of Dundee",
	"The University of Edinburgh",
	"The University of Essex",
	"The University of Evansville",
	"The University of Exeter",
	"The University of Falmouth",
	"The University of Florida",
	"The University of Georgia",
	"The University of Houston",
	"The University of Houston - Clear Lake",
	"The University of Houston - Downtown",
	"The University of Huddersfield",
	"The University of Idaho",
	"The University of Illinois at Chicago",
	"The University of Illinois at Urbana-Champaign",
	"The University of Iowa",
	"The University of Kansas",
	"The University of Kent",
	"The University of Kentucky",
	"The University of Leeds",
	"The University of Lincoln",
	"The University of Liverpool",
	"The University of Ljubljana",
	"The University of Louisiana at Lafayette",
	"The University of Louisiana at Monroe",
	"The University of Louisville",
	"The University of Manchester",
	"The University of Manitoba",
	"The University of Maryland, Baltimore County",
	"The University of Maryland, College Park",
	"The University of Massachusetts Amherst",
	"The University of Massachusetts Boston",
	"The University of Massachusetts Dartmouth",
	"The University of Massachusetts Lowell",
	"The University of Miami",
	"The University of Michigan",
	"The University of Minnesota",
	"The University of Missouri",
	"The University of Missouri-Kansas City",
	"The University of Málaga",
	"The University of Nebraska-Lincoln",
	"The University of New Brunswick",
	"The University of New Hampshire",
	"The University of New Haven",
	"The University of North Carolina at Chapel Hill",
	"The University of North Carolina at Charlotte",
	"The University of North Carolina at Greensboro",
	"The University of North Texas",
	"The University of Northampton",
	"The University of Notre Dame",
	"The University of Nottingham",
	"The University of Oklahoma",
	"The University of Oregon",
	"The University of Oxford",
	"The University of Pennsylvania",
	"The University of Phoenix",
	"The University of Pittsburgh",
	"The University of Portland",
	"The University of Portsmouth",
	"The University of Richmond",
	"The University of Rochester",
	"The University of San Francisco",
	"The University of South Carolina",
	"The University of South Florida",
	"The University of Southern California",
	"The University of Southern Denmark",
	"The University of Tampa",
	"The University of Tennessee",
	"The University of Texas Rio Grande Valley",
	"The University of Texas at Arlington",
	"The University of Texas at Austin",
	"The University of Texas at Dallas",
	"The University of Texas at El Paso",
	"The University of Texas of the Permian Basin",
	"The University of Texas - Pan American",
	"The University of Tulsa",
	"The University of Utah",
	"The University of Vermont",
	"The University of Victoria",
	"The University of Virginia",
	"The University of Warsaw",
	"The University of Washington",
	"The University of Waterloo",
	"The University of West Georgia",
	"The University of Western Ontario",
	"The University of Westminster",
	"The University of Windsor",
	"The University of Wisconsin-Green Bay",
	"The University of Wisconsin-La Crosse",
	"The University of Wisconsin-Madison",
	"The University of Wisconsin-Milwaukee",
	"The University of Wisconsin-Oshkosh",
	"The University of Wisconsin-Parkside",
	"The University of Wisconsin-Platteville",
	"The University of Wisconsin-River Falls",
	"The University of Wisconsin-Stevens Point",
	"The University of Wisconsin-Stout",
	"The University of Wisconsin-Superior",
	"The University of Wisconsin-Whitewater",
	"The University of Wolverhampton",
	"The University of York",
	"The University of Zagreb",
	"The University of the Pacific",
	"The Université de Sherbrooke",
	"Thomas Edison State College",
	"Trent University",
	"Trinity College",
	"Trinity University - San Antonio",
	"Trinity Valley School",
	"Troy University",
	"Tufts University",
	"Tulane University",
	"University at Albany, SUNY",
	"University at Binghamton, SUNY",
	"University at Buffalo, SUNY",
	"University at New Paltz, SUNY",
	"University at Orange, SUNY",
	"University at Oswego, SUNY",
	"University at Plattsburgh, SUNY",
	"University of Cincinnati Clermont College",
	"Utah State University",
	"Utica College",
	"Vanderbilt University",
	"Villanova University",
	"Virginia Tech",
	"Wake Forest University",
	"Washington State University",
	"Washington University in St. Louis",
	"Wayne State University",
	"Wellesley College",
	"Wentworth Institute of Technology",
	"Wesleyan University",
	"West Chester University",
	"Western Governors University",
	"Western Kentucky University",
	"Western Michigan University",
	"Western New England University",
	"Western University",
	"Western Washington University",
	"Wichita State University",
	"Xavier University",
	"Yale University",
	"York University",
	"The University of Chicago",
	"York College, CUNY",
] as const;

export const majors = [
	"Accounting",
	"Accounting Technician",
	"Actuarial Science",
	"Aerospace/Aeronautical Engineering",
	"Agricultural Business & Management",
	"Agricultural Economics",
	"Agricultural Mechanization",
	"Agricultural Production",
	"Agricultural/Bioengineering",
	"American/English Literature",
	"Applied Mathematics",
	"Architectural Engineering",
	"Art History, Criticism & Conservation",
	"Art, General",
	"Astronomy",
	"Atmospheric Sciences & Meteorology",
	"Banking & Financial Support Services",
	"Biochemistry & Biophysics",
	"Biology, General",
	"Biomedical Engineering",
	"Business Administration & Management, General",
	"Business/Management Quantitative Methods, General",
	"Business/Managerial Economics",
	"Cell/Cellular Biology",
	"Chemical Engineering",
	"Chemistry",
	"Cinematography/Film/Vide Production",
	"Civil Engineering",
	"Classical/Ancient Languages & Literatures",
	"Comparative Literature",
	"Computer & Information Sciences, General",
	"Computer Engineering",
	"Computer Networking/Telecommunications",
	"Computer Science",
	"Computer Software & Media Applications",
	"Computer System Administration",
	"Construction Engineering/Management",
	"Creative Writing",
	"Criminology",
	"Cyber Security",
	"Data Management Technology",
	"Dental Assisting",
	"Design & Visual Communications, General",
	"Ecology",
	"Economics",
	"Electrical Engineering",
	"Engineering (Pre-Engineering), General",
	"English Language & Literature, General",
	"Finance, General",
	"Financial Planning & Services",
	"Fine/Studio Arts",
	"Food Sciences & Technology",
	"Foreign Languages/Literatures, General",
	"French Language & Literature",
	"Genetics",
	"Geological & Earth Sciences",
	"Graphic Design",
	"Health Services Administration,General",
	"Human Resources Development/Training",
	"Human Resources Management",
	"Industrial Design",
	"Industrial Engineering",
	"Information Science",
	"Information Technology And Systems",
	"Insurance & Risk Management",
	"International Business Management",
	"International Relations & Affairs",
	"Investments & Securities",
	"Labor/Industrial Relations",
	"Law (Pre-Law)",
	"Legal Administrative Assisting/Secretarial",
	"Legal Studies, General",
	"Linguistics",
	"Logistics & Materials Management",
	"Management Information Systems",
	"Marine/Aquatic Biology",
	"Marketing Management & Research",
	"Mathematics, General",
	"Mechanical Engineering",
	"Medical Assisting",
	"Medical Office/Secretarial",
	"Medical Records",
	"Medical/Clinical Assisting, General",
	"Microbiology & Immunology",
	"Music, General",
	"Music, Theory & Composition",
	"Natural Resources Conservation, General",
	"Natural Resources Management",
	"Neuroscience",
	"Nuclear Engineering",
	"Occupational Therapy Assisting",
	"Philosophy",
	"Photography",
	"Physical Sciences, General",
	"Physical Therapy Assisting",
	"Physics",
	"Political Science & Government",
	"Psychology, Clinical & Counseling",
	"Psychology, General",
	"Public Speaking",
	"Sales, Merchandising, & Marketing, General",
	"Secretarial Studies & Office Administration",
	"Small Business Management/Operations",
	"Social Sciences, General",
	"Sociology",
	"Software Engineering",
	"Statistics",
	"Supply Chain Management",
	"Urban Studies/Urban Affairs",
	"Webpage Design",
] as const;
