export enum PermissionType {
	//! DANGER: DO NOT CHANGE ANYTHING (NAMINGS, VALUES) OR REARRANGE. CAN CAUSE MAJOR ISSUES.
	ADMIN = 1 << 0, // can access admin panel

	VIEW_ROLES = 1 << 1,
	CREATE_ROLES = 1 << 2,
	EDIT_ROLES = 1 << 3,
	DELETE_ROLES = 1 << 4,

	VIEW_USERS = 1 << 5,
	CHANGE_USER_ROLES = 1 << 6,
	BAN_USERS = 1 << 7,

	VIEW_EVENTS = 1 << 8,
	CREATE_EVENTS = 1 << 9,
	EDIT_EVENTS = 1 << 10,
	DELETE_EVENTS = 1 << 11,

	CHECK_IN = 1 << 12,
	CREATE_SCANS = 1 << 13,

	MANAGE_NAVLINKS = 1 << 14,
	MANAGE_REGISTRATION = 1 << 15,

	/* You can add new permissions following the pattern:
		NEW_PERMISSION = 1 << n,
	*/
}
