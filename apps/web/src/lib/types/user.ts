import c from "config";

export type GenderOptionsType = (typeof c.registration.genderOptions)[number];
export type EthnicityOptionsType =
	(typeof c.registration.ethnicityOptions)[number];
export type RaceOptionsType = (typeof c.registration.raceOptions)[number];
export type MajorOptionsType = (typeof c.registration.majors)[number];
export type LevelOfStudyOptionsType =
	(typeof c.registration.levelsOfStudy)[number];
export type SchoolOptionsType = (typeof c.registration.schools)[number];
export type SoftwareExperienceOptionsType =
	(typeof c.registration.softwareExperienceOptions)[number];
export type ShirtSizeOptionsType =
	(typeof c.registration.shirtSizeOptions)[number];
export type HeardFromOptionsType =
	(typeof c.registration.heardFromOptions)[number];
