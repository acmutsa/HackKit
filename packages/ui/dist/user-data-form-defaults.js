export function toUserDataFormDefaultValues(userData) {
    return {
        age: userData.age,
        gender: userData.gender,
        race: userData.race,
        ethnicity: userData.ethnicity,
        shirtSize: userData.shirtSize,
        dietaryRestrictions: userData.dietaryRestrictions,
        accommodationNote: userData.accommodationNote ?? "",
        phoneNumber: userData.phoneNumber ?? "",
        countryOfResidence: userData.countryOfResidence,
        hasAcceptedMLHCodeOfConduct: userData.hasAcceptedMLHCodeOfConduct,
        hasSharedDataWithMLH: userData.hasSharedDataWithMLH,
        isEmailable: userData.isEmailable,
    };
}
//# sourceMappingURL=user-data-form-defaults.js.map