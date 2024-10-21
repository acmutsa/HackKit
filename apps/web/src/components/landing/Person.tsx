type Picture = {
	link: string;
	zoom: number;
	x: number;
	y: number;
};

type Person = {
	name: string;
	nameSize: number;
	team: string;
	professionalPicture: Picture;
	personalityPicture: Picture;
	linkedin: string;
	github: string;
	personal: string;
};

type Team = {
	team: Person[];
};
