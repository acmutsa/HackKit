# Use Core-owned configurable User Data Options

HackKit Core will own configurable User Data Options rather than baking demographic and logistics values directly into the UI package or fixed Core enums. Applications can override allowed values for fields like gender, race, ethnicity, shirt size, and dietary restrictions, while Core validation and HackKit UI consume the same option source. This keeps validation, storage expectations, and rendering aligned without forcing one universal demographic vocabulary on every hackathon.
