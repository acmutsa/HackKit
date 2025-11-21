import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  json,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { nanoid } from "nanoid";

import {
  perms,
  discordInviteStatus,
  ticketStatus,
  discordVerificationStatus,
} from "../config/hackkit.config";


export const uuid = {
  toDriver() {
    return nanoid();
  },
};

export const rolesEnum = {
  toDriver(value: (typeof perms)[number]) {
    return value;
  },
};

export const fileTypesEnum = {
  toDriver(value: "resume" | "profilePhoto") {
    return value;
  },
};

export const inviteType = {
  toDriver(value: (typeof discordInviteStatus)[number]) {
    return value;
  },
};

export const chatType = {
  toDriver(value: "ticket") {
    return value;
  },
};

export const ticketStatusEnum = {
  toDriver(value: (typeof ticketStatus)[number]) {
    return value;
  },
};

export const discordVerificationStatusEnum = {
  toDriver(value: (typeof discordVerificationStatus)[number]) {
    return value;
  },
};


export const userCommonData = pgTable("user_common_data", {
  clerkID: text("clerk_id").primaryKey(),

  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  hackerTag: text("hacker_tag").notNull().unique(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  race: text("race").notNull(),
  ethnicity: text("ethnicity").notNull(),
  shirtSize: text("shirt_size").notNull(),
  dietRestrictions: json("diet_restrictions").notNull().default([]),
  
  accommodationNote: text("accommodation_note"),
  discord: text("discord"),
  pronouns: text("pronouns").notNull(),
  bio: text("bio").notNull(),
  skills: json("skills").notNull().default([]),
  profilePhoto: text("profile_photo").notNull(),
  phoneNumber: text("phone_number").notNull(),
  countryOfResidence: text("country_of_residence").notNull(),

  isFullyRegistered: boolean("is_fully_registered").notNull().default(false),
  signupTime: timestamp("signup_time", { withTimezone: false })
    .notNull()
    .defaultNow(),
  isSearchable: boolean("is_searchable").notNull().default(true),
  role: text("role").notNull().default("hacker"),
  checkinTimestamp: timestamp("checkin_timestamp", {
    withTimezone: false,
  }),
  isRSVPed: boolean("is_rsvped").notNull().default(false),
  isApproved: boolean("is_approved").notNull().default(false),
});

export const userCommonRelations = relations(
  userCommonData,
  ({ one, many }) => ({
    hackerData: one(userHackerData, {
      fields: [userCommonData.clerkID],
      references: [userHackerData.clerkID],
    }),
    discordVerification: one(discordVerification, {
      fields: [userCommonData.clerkID],
      references: [discordVerification.clerkID],
    }),
    files: many(files),
    scans: many(scans),
    tickets: many(ticketsToUsers),
    chats: many(chatsToUsers),
    messages: many(chatMessages),
  })
);

export const userHackerData = pgTable("user_hacker_data", {
  clerkID: text("clerk_id")
    .primaryKey()
    .references(() => userCommonData.clerkID, { onDelete: "cascade" }),

  university: text("university").notNull(),
  major: text("major").notNull(),
  schoolID: text("school_id").notNull(),
  levelOfStudy: text("level_of_study").notNull(),
  hackathonsAttended: integer("hackathons_attended").notNull(),
  softwareExperience: text("software_experience").notNull(),
  heardFrom: text("heard_from"),
  GitHub: text("github"),
  LinkedIn: text("linkedin"),
  PersonalWebsite: text("personal_website"),
  resume: text("resume").notNull().default("https://static.acmutsa.org/No Resume Provided.pdf"),

  group: integer("group").notNull(),
  hasAcceptedMLHCoC: boolean("has_accepted_mlh_coc").notNull(),
  hasSharedDataWithMLH: boolean("has_shared_data_with_mlh").notNull(),
  isEmailable: boolean("is_emailable").notNull(),
});

export const userHackerRelations = relations(userHackerData, ({ one }) => ({
  commonData: one(userCommonData, {
    fields: [userHackerData.clerkID],
    references: [userCommonData.clerkID],
  }),
}));

export const events = pgTable("events", {
  id: integer("id").primaryKey(),
  title: text("name").notNull(),
  startTime: timestamp("start_time", { withTimezone: false }).notNull(),
  endTime: timestamp("end_time", { withTimezone: false }).notNull(),
  location: text("location").default("TBD"),
  description: text("description").notNull(),
  type: text("type").notNull(),
  host: text("host"),
  hidden: boolean("hidden").notNull().default(false),
});

export const eventsRelations = relations(events, ({ many }) => ({
  scans: many(scans),
}));

export const files = pgTable("files", {
  id: text("id").primaryKey(),
  presignedURL: text("presigned_url").notNull(),
  key: text("key").notNull().unique(),
  validated: boolean("validated").notNull().default(false),
  type: text("type").notNull(),
  ownerID: text("owner_id").notNull(),
});

export const filesRelations = relations(files, ({ one }) => ({
  owner: one(userCommonData, {
    fields: [files.ownerID],
    references: [userCommonData.clerkID],
  }),
}));

export const scans = pgTable(
  "scans",
  {
    updatedAt: timestamp("updated_at", { withTimezone: false })
      .notNull()
      .defaultNow(),
    userID: text("user_id").notNull(),
    eventID: integer("event_id").notNull(),
    count: integer("count").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userID, t.eventID] }),
  })
);

export const scansRelations = relations(scans, ({ one }) => ({
  user: one(userCommonData, {
    fields: [scans.userID],
    references: [userCommonData.clerkID],
  }),
  event: one(events, {
    fields: [scans.eventID],
    references: [events.id],
  }),
}));

export const errorLog = pgTable("error_log", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: false })
    .notNull()
    .defaultNow(),
  userID: text("user_id"),
  route: text("route"),
  message: text("message").notNull(),
});

export const discordVerification = pgTable("discord_verification", {
  code: text("code").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: false })
    .notNull()
    .defaultNow(),
  clerkID: text("clerk_id"),
  discordUserID: text("discord_user_id").notNull(),
  discordUserTag: text("discord_user_tag").notNull(),
  discordProfilePhoto: text("discord_profile_photo").notNull(),
  discordName: text("discord_name").notNull(),
  status: text("status").notNull().default("pending"),
  guild: text("guild").notNull(),
});

/* Tickets */

export const tickets = pgTable("tickets", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("awaiting"),
  createdAt: timestamp("created_at", { withTimezone: false })
    .notNull()
    .defaultNow(),
});

export const ticketRelations = relations(tickets, ({ one, many }) => ({
  chat: one(chats, {
    fields: [tickets.id],
    references: [chats.ticketID],
  }),
  tickets: many(ticketsToUsers),
}));

export const chats = pgTable("chats", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  ticketID: text("ticket_id").references(() => tickets.id),
  author: text("author").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false })
    .notNull()
    .defaultNow(),
});

export const chatRelations = relations(chats, ({ many }) => ({
  messages: many(chatMessages),
  members: many(chatsToUsers),
}));

export const chatMessages = pgTable("chat_messages", {
  id: integer("id").primaryKey(),
  chatID: text("chat_id").notNull(),
  message: text("message").notNull(),
  authorID: text("author_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false })
    .notNull()
    .defaultNow(),
});

export const chatMessageRelations = relations(
  chatMessages,
  ({ one }) => ({
    chat: one(chats, {
      fields: [chatMessages.chatID],
      references: [chats.id],
    }),
    author: one(userCommonData, {
      fields: [chatMessages.authorID],
      references: [userCommonData.clerkID],
    }),
  })
);

export const ticketsToUsers = pgTable(
  "tickets_to_users",
  {
    ticketID: text("ticket_id").notNull().references(() => tickets.id),
    userID: text("user_id").notNull().references(() => userCommonData.clerkID),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userID, t.ticketID] }),
  })
);

export const chatsToUsers = pgTable(
  "chats_to_users",
  {
    chatID: text("chat_id").notNull().references(() => chats.id),
    userID: text("user_id").notNull().references(() => userCommonData.clerkID),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userID, t.chatID] }),
  })
);
