// packages/db/schema.ts
import * as pg from "drizzle-orm/pg-core";
import * as sqlite from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

import {
  perms,
  discordInviteStatus,
  ticketStatus,
  discordVerificationStatus,
} from "../config/hackkit.config";

export type Dialect = "pg" | "sqlite";

/**
 * defineSchema builds either the Postgres or SQLite schema,
 * but lives in ONE file.
 */
export function defineSchema(dialect: Dialect) {
  const isPg = dialect === "pg";

  // ---------- Custom types / enums ----------

  // uuid
  const uuid = isPg
    ? {
        toDriver() {
          return nanoid();
        },
      }
    : sqlite.customType<{ data: string; notNull: true; default: true }>({
        dataType() {
          return "text";
        },
        toDriver() {
          return nanoid();
        },
      });

  // rolesEnum
  const rolesEnum = isPg
    ? {
        toDriver(value: (typeof perms)[number]) {
          return value;
        },
      }
    : sqlite.customType<{
        data: (typeof perms)[number];
        notNull: true;
        default: true;
      }>({
        dataType() {
          return "text";
        },
        toDriver(value) {
          return value;
        },
      });

  const fileTypesEnum = isPg
    ? {
        toDriver(value: "resume" | "profilePhoto") {
          return value;
        },
      }
    : sqlite.customType<{
        data: "resume" | "profilePhoto";
        notNull: true;
        default: true;
      }>({
        dataType() {
          return "text";
        },
        toDriver(value) {
          return value;
        },
      });

  const inviteType = isPg
    ? {
        toDriver(value: (typeof discordInviteStatus)[number]) {
          return value;
        },
      }
    : sqlite.customType<{
        data: (typeof discordInviteStatus)[number];
        notNull: true;
        default: true;
      }>({
        dataType() {
          return "text";
        },
        toDriver(value) {
          return value;
        },
      });

  const chatType = isPg
    ? {
        toDriver(value: "ticket") {
          return value;
        },
      }
    : sqlite.customType<{
        data: "ticket";
        notNull: true;
        default: true;
      }>({
        dataType() {
          return "text";
        },
        toDriver(value) {
          return value;
        },
      });

  const ticketStatusEnum = isPg
    ? {
        toDriver(value: (typeof ticketStatus)[number]) {
          return value;
        },
      }
    : sqlite.customType<{
        data: (typeof ticketStatus)[number];
        notNull: true;
        default: true;
      }>({
        dataType() {
          return "text";
        },
        toDriver(value) {
          return value;
        },
      });

  const discordVerificationStatusEnum = isPg
    ? {
        toDriver(value: (typeof discordVerificationStatus)[number]) {
          return value;
        },
      }
    : sqlite.customType<{
        data: (typeof discordVerificationStatus)[number];
        notNull: true;
        default: true;
      }>({
        dataType() {
          return "text";
        },
        toDriver(value) {
          return value;
        },
      });

  // ---------- Tables (dialect-specific definitions) ----------

  const userCommonData: any = isPg
    ? pg.pgTable("user_common_data", {
        clerkID: pg.text("clerk_id").primaryKey(),

        firstName: pg.text("first_name").notNull(),
        lastName: pg.text("last_name").notNull(),
        email: pg.text("email").notNull().unique(),
        hackerTag: pg.text("hacker_tag").notNull().unique(),
        age: pg.integer("age").notNull(),
        gender: pg.text("gender").notNull(),
        race: pg.text("race").notNull(),
        ethnicity: pg.text("ethnicity").notNull(),
        shirtSize: pg.text("shirt_size").notNull(),
        dietRestrictions: pg.json("diet_restrictions").notNull().default([]),

        accommodationNote: pg.text("accommodation_note"),
        discord: pg.text("discord"),
        pronouns: pg.text("pronouns").notNull(),
        bio: pg.text("bio").notNull(),
        skills: pg.json("skills").notNull().default([]),
        profilePhoto: pg.text("profile_photo").notNull(),
        phoneNumber: pg.text("phone_number").notNull(),
        countryOfResidence: pg.text("country_of_residence").notNull(),

        isFullyRegistered: pg
          .boolean("is_fully_registered")
          .notNull()
          .default(false),
        signupTime: pg
          .timestamp("signup_time", { withTimezone: false })
          .notNull()
          .defaultNow(),
        isSearchable: pg.boolean("is_searchable").notNull().default(true),
        role: pg.text("role").notNull().default("hacker"),
        checkinTimestamp: pg.timestamp("checkin_timestamp", {
          withTimezone: false,
        }),
        isRSVPed: pg.boolean("is_rsvped").notNull().default(false),
        isApproved: pg.boolean("is_approved").notNull().default(false),
      })
    : sqlite.sqliteTable("user_common_data", {
        clerkID: sqlite.text("clerk_id", { length: 255 }).primaryKey(),

        firstName: sqlite.text("first_name", { length: 50 }).notNull(),
        lastName: sqlite.text("last_name", { length: 50 }).notNull(),
        email: sqlite.text("email", { length: 255 }).notNull().unique(),
        hackerTag: sqlite.text("hacker_tag", { length: 50 }).notNull().unique(),
        age: sqlite.integer("age").notNull(),
        gender: sqlite.text("gender", { length: 50 }).notNull(),
        race: sqlite.text("race", { length: 75 }).notNull(),
        ethnicity: sqlite.text("ethnicity", { length: 50 }).notNull(),
        shirtSize: sqlite.text("shirt_size", { length: 5 }).notNull(),
        dietRestrictions: sqlite
          .text("diet_restrictions", { mode: "json" })
          .notNull()
          .$type<string[]>()
          .default([]),
        accommodationNote: sqlite.text("accommodation_note"),
        discord: sqlite.text("discord", { length: 60 }),
        pronouns: sqlite.text("pronouns", { length: 20 }).notNull(),
        bio: sqlite.text("bio").notNull(),
        skills: sqlite
          .text("skills", { mode: "json" })
          .notNull()
          .$type<string[]>()
          .default([]),
        profilePhoto: sqlite.text("profile_photo", { length: 255 }).notNull(),
        phoneNumber: sqlite.text("phone_number", { length: 30 }).notNull(),
        countryOfResidence: sqlite.text("country_of_residence", {
          length: 3,
        }).notNull(),

        isFullyRegistered: sqlite
          .integer("is_fully_registered", { mode: "boolean" })
          .notNull()
          .default(false),
        signupTime: sqlite
          .integer("signup_time", { mode: "timestamp_ms" })
          .notNull()
          .default(sql`(current_timestamp)`),
        isSearchable: sqlite
          .integer("is_searchable", { mode: "boolean" })
          .notNull()
          .default(true),
        role: (rolesEnum as any)("role").notNull().default("hacker"),
        checkinTimestamp: sqlite.integer("checkin_timestamp", {
          mode: "timestamp_ms",
        }),
        isRSVPed: sqlite
          .integer("is_rsvped", { mode: "boolean" })
          .notNull()
          .default(false),
        isApproved: sqlite
          .integer("is_approved", { mode: "boolean" })
          .notNull()
          .default(false),
      });

  const userHackerData: any = isPg
    ? pg.pgTable("user_hacker_data", {
        clerkID: pg
          .text("clerk_id")
          .primaryKey()
          .references(() => userCommonData.clerkID, { onDelete: "cascade" }),

        university: pg.text("university").notNull(),
        major: pg.text("major").notNull(),
        schoolID: pg.text("school_id").notNull(),
        levelOfStudy: pg.text("level_of_study").notNull(),
        hackathonsAttended: pg.integer("hackathons_attended").notNull(),
        softwareExperience: pg.text("software_experience").notNull(),
        heardFrom: pg.text("heard_from"),
        GitHub: pg.text("github"),
        LinkedIn: pg.text("linkedin"),
        PersonalWebsite: pg.text("personal_website"),
        resume: pg
          .text("resume")
          .notNull()
          .default("https://static.acmutsa.org/No Resume Provided.pdf"),

        group: pg.integer("group").notNull(),
        hasAcceptedMLHCoC: pg.boolean("has_accepted_mlh_coc").notNull(),
        hasSharedDataWithMLH: pg.boolean("has_shared_data_with_mlh").notNull(),
        isEmailable: pg.boolean("is_emailable").notNull(),
      })
    : sqlite.sqliteTable("user_hacker_data", {
        clerkID: sqlite
          .text("clerk_id", { length: 255 })
          .primaryKey()
          .references(() => userCommonData.clerkID, { onDelete: "cascade" }),

        university: sqlite.text("university", { length: 200 }).notNull(),
        major: sqlite.text("major", { length: 200 }).notNull(),
        schoolID: sqlite.text("school_id", { length: 50 }).notNull(),
        levelOfStudy: sqlite.text("level_of_study", { length: 50 }).notNull(),
        hackathonsAttended: sqlite.integer("hackathons_attended").notNull(),
        softwareExperience: sqlite.text("software_experience", {
          length: 25,
        }).notNull(),
        heardFrom: sqlite.text("heard_from", { length: 50 }),
        GitHub: sqlite.text("github", { length: 100 }),
        LinkedIn: sqlite.text("linkedin", { length: 100 }),
        PersonalWebsite: sqlite.text("personal_website", { length: 100 }),
        resume: sqlite
          .text("resume", { length: 255 })
          .notNull()
          .default("https://static.acmutsa.org/No%20Resume%20Provided.pdf"),

        group: sqlite.integer("group").notNull(),
        hasAcceptedMLHCoC: sqlite
          .integer("has_accepted_mlh_coc", { mode: "boolean" })
          .notNull(),
        hasSharedDataWithMLH: sqlite
          .integer("has_shared_data_with_mlh", { mode: "boolean" })
          .notNull(),
        isEmailable: sqlite.integer("is_emailable", { mode: "boolean" }).notNull(),
      });

  const events: any = isPg
    ? pg.pgTable("events", {
        id: pg.integer("id").primaryKey(),
        title: pg.text("name").notNull(),
        startTime: pg.timestamp("start_time", { withTimezone: false }).notNull(),
        endTime: pg.timestamp("end_time", { withTimezone: false }).notNull(),
        location: pg.text("location").default("TBD"),
        description: pg.text("description").notNull(),
        type: pg.text("type").notNull(),
        host: pg.text("host"),
        hidden: pg.boolean("hidden").notNull().default(false),
      })
    : sqlite.sqliteTable("events", {
        id: sqlite.integer("id", { mode: "number" }).notNull().primaryKey(),
        title: sqlite.text("name", { length: 255 }).notNull(),
        startTime: sqlite
          .integer("start_time", { mode: "timestamp_ms" })
          .notNull(),
        endTime: sqlite.integer("end_time", { mode: "timestamp_ms" }).notNull(),
        location: sqlite.text("location", { length: 255 }).default("TBD"),
        description: sqlite.text("description").notNull(),
        type: sqlite.text("type", { length: 50 }).notNull(),
        host: sqlite.text("host", { length: 255 }),
        hidden: sqlite.integer("hidden", { mode: "boolean" }).notNull().default(false),
      });

  const files: any = isPg
    ? pg.pgTable("files", {
        id: pg.text("id").primaryKey(),
        presignedURL: pg.text("presigned_url").notNull(),
        key: pg.text("key").notNull().unique(),
        validated: pg.boolean("validated").notNull().default(false),
        type: pg.text("type").notNull(),
        ownerID: pg.text("owner_id").notNull(),
      })
    : sqlite.sqliteTable("files", {
        id: sqlite.text("id", { length: 255 }).notNull().primaryKey().unique(),
        presignedURL: sqlite.text("presigned_url").notNull(),
        key: sqlite.text("key", { length: 500 }).notNull().unique(),
        validated: sqlite
          .integer("validated", { mode: "boolean" })
          .notNull()
          .default(false),
        type: (fileTypesEnum as any)("type").notNull(),
        ownerID: sqlite.text("owner_id", { length: 255 }).notNull(),
      });

  const scans: any = isPg
    ? pg.pgTable(
        "scans",
        {
          updatedAt: pg
            .timestamp("updated_at", { withTimezone: false })
            .notNull()
            .defaultNow(),
          userID: pg.text("user_id").notNull(),
          eventID: pg.integer("event_id").notNull(),
          count: pg.integer("count").notNull(),
        },
        (t) => ({
          pk: pg.primaryKey({ columns: [t.userID, t.eventID] }),
        }),
      )
    : sqlite.sqliteTable(
        "scans",
        {
          updatedAt: sqlite
            .integer("updated_at", { mode: "timestamp_ms" })
            .notNull()
            .default(sql`(current_timestamp)`),
          userID: sqlite.text("user_id", { length: 255 }).notNull(),
          eventID: sqlite.integer("event_id").notNull(),
          count: sqlite.integer("count").notNull(),
        },
        (t) => [sqlite.primaryKey({ columns: [t.userID, t.eventID] })],
      );

  const errorLog: any = isPg
    ? pg.pgTable("error_log", {
        id: pg.text("id").primaryKey(),
        createdAt: pg
          .timestamp("created_at", { withTimezone: false })
          .notNull()
          .defaultNow(),
        userID: pg.text("user_id"),
        route: pg.text("route"),
        message: pg.text("message").notNull(),
      })
    : sqlite.sqliteTable("error_log", {
        id: sqlite.text("id", { length: 50 }).notNull().primaryKey(),
        createdAt: sqlite
          .integer("created_at", { mode: "timestamp_ms" })
          .notNull()
          .default(sql`(current_timestamp)`),
        userID: sqlite.text("user_id", { length: 255 }),
        route: sqlite.text("route", { length: 255 }),
        message: sqlite.text("message").notNull(),
      });

  const discordVerification: any = isPg
    ? pg.pgTable("discord_verification", {
        code: pg.text("code").primaryKey(),
        createdAt: pg
          .timestamp("created_at", { withTimezone: false })
          .notNull()
          .defaultNow(),
        clerkID: pg.text("clerk_id"),
        discordUserID: pg.text("discord_user_id").notNull(),
        discordUserTag: pg.text("discord_user_tag").notNull(),
        discordProfilePhoto: pg.text("discord_profile_photo").notNull(),
        discordName: pg.text("discord_name").notNull(),
        status: pg.text("status").notNull().default("pending"),
        guild: pg.text("guild").notNull(),
      })
    : sqlite.sqliteTable("discord_verification", {
        code: sqlite.text("code", { length: 255 }).notNull().primaryKey(),
        createdAt: sqlite
          .integer("created_at", { mode: "timestamp_ms" })
          .notNull()
          .default(sql`(current_timestamp)`),
        clerkID: sqlite.text("clerk_id", { length: 255 }),
        discordUserID: sqlite.text("discord_user_id", { length: 255 }).notNull(),
        discordUserTag: sqlite.text("discord_user_tag", { length: 255 }).notNull(),
        discordProfilePhoto: sqlite.text("discord_profile_photo", {
          length: 255,
        }).notNull(),
        discordName: sqlite.text("discord_name", { length: 255 }).notNull(),
        status: (discordVerificationStatusEnum as any)("status")
          .notNull()
          .default("pending"),
        guild: sqlite.text("guild", { length: 100 }).notNull(),
      });

  const tickets: any = isPg
    ? pg.pgTable("tickets", {
        id: pg.text("id").primaryKey(),
        title: pg.text("title").notNull(),
        description: pg.text("description").notNull(),
        status: pg.text("status").notNull().default("awaiting"),
        createdAt: pg
          .timestamp("created_at", { withTimezone: false })
          .notNull()
          .defaultNow(),
      })
    : sqlite.sqliteTable("tickets", {
        id: sqlite.text("id").primaryKey(),
        title: sqlite.text("title", { length: 255 }).notNull(),
        description: sqlite.text("description").notNull(),
        status: (ticketStatusEnum as any)("status").notNull().default("awaiting"),
        createdAt: sqlite
          .integer("created_at", { mode: "timestamp_ms" })
          .notNull()
          .default(sql`(current_timestamp)`),
      });

  const chats: any = isPg
    ? pg.pgTable("chats", {
        id: pg.text("id").primaryKey(),
        type: pg.text("type").notNull(),
        ticketID: pg.text("ticket_id").references(() => tickets.id),
        author: pg.text("author").notNull(),
        createdAt: pg
          .timestamp("created_at", { withTimezone: false })
          .notNull()
          .defaultNow(),
      })
    : sqlite.sqliteTable("chats", {
        id: sqlite.text("id").primaryKey(),
        type: (chatType as any)("type").notNull(),
        ticketID: sqlite.text("ticket_id").references(() => tickets.id),
        author: sqlite.text("author").notNull(),
        createdAt: sqlite
          .integer("created_at", { mode: "timestamp_ms" })
          .notNull()
          .default(sql`(current_timestamp)`),
      });

  const chatMessages: any = isPg
    ? pg.pgTable("chat_messages", {
        id: pg.integer("id").primaryKey(),
        chatID: pg.text("chat_id").notNull(),
        message: pg.text("message").notNull(),
        authorID: pg.text("author_id").notNull(),
        createdAt: pg
          .timestamp("created_at", { withTimezone: false })
          .notNull()
          .defaultNow(),
      })
    : sqlite.sqliteTable("chat_messages", {
        id: sqlite.integer("id", { mode: "number" }).primaryKey(),
        chatID: sqlite.text("chat_id").notNull(),
        message: sqlite.text("message").notNull(),
        authorID: sqlite.text("author_id").notNull(),
        createdAt: sqlite
          .integer("created_at", { mode: "timestamp_ms" })
          .notNull()
          .default(sql`(current_timestamp)`),
      });

  const ticketsToUsers: any = isPg
    ? pg.pgTable(
        "tickets_to_users",
        {
          ticketID: pg.text("ticket_id").notNull().references(() => tickets.id),
          userID: pg
            .text("user_id")
            .notNull()
            .references(() => userCommonData.clerkID),
        },
        (t) => ({
          pk: pg.primaryKey({ columns: [t.userID, t.ticketID] }),
        }),
      )
    : sqlite.sqliteTable(
        "tickets_to_users",
        {
          ticketID: sqlite
            .text("ticket_id")
            .notNull()
            .references(() => tickets.id),
          userID: sqlite
            .text("user_id")
            .notNull()
            .references(() => userCommonData.clerkID),
        },
        (t) => [sqlite.primaryKey({ columns: [t.userID, t.ticketID] })],
      );

  const chatsToUsers: any = isPg
    ? pg.pgTable(
        "chats_to_users",
        {
          chatID: pg.text("chat_id").notNull().references(() => chats.id),
          userID: pg
            .text("user_id")
            .notNull()
            .references(() => userCommonData.clerkID),
        },
        (t) => ({
          pk: pg.primaryKey({ columns: [t.userID, t.chatID] }),
        }),
      )
    : sqlite.sqliteTable(
        "chats_to_users",
        {
          chatID: sqlite
            .text("chat_id")
            .notNull()
            .references(() => chats.id),
          userID: sqlite
            .text("user_id")
            .notNull()
            .references(() => userCommonData.clerkID),
        },
        (t) => [sqlite.primaryKey({ columns: [t.userID, t.chatID] })],
      );

  // ---------- Relations (same for both dialects) ----------

  const userCommonRelations = relations(
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
    }),
  );

  const userHackerRelations = relations(userHackerData, ({ one }) => ({
    commonData: one(userCommonData, {
      fields: [userHackerData.clerkID],
      references: [userCommonData.clerkID],
    }),
  }));

  const eventsRelations = relations(events, ({ many }) => ({
    scans: many(scans),
  }));

  const filesRelations = relations(files, ({ one }) => ({
    owner: one(userCommonData, {
      fields: [files.ownerID],
      references: [userCommonData.clerkID],
    }),
  }));

  const scansRelations = relations(scans, ({ one }) => ({
    user: one(userCommonData, {
      fields: [scans.userID],
      references: [userCommonData.clerkID],
    }),
    event: one(events, {
      fields: [scans.eventID],
      references: [events.id],
    }),
  }));

  const ticketRelations = relations(tickets, ({ one, many }) => ({
    chat: one(chats, {
      fields: [tickets.id],
      references: [chats.ticketID],
    }),
    tickets: many(ticketsToUsers),
  }));

  const chatRelations = relations(chats, ({ many }) => ({
    messages: many(chatMessages),
    members: many(chatsToUsers),
  }));

  const chatMessageRelations = relations(chatMessages, ({ one }) => ({
    chat: one(chats, {
      fields: [chatMessages.chatID],
      references: [chats.id],
    }),
    author: one(userCommonData, {
      fields: [chatMessages.authorID],
      references: [userCommonData.clerkID],
    }),
  }));

  const ticketsToUserRelations = relations(ticketsToUsers, ({ one }) => ({
    ticket: one(tickets, {
      fields: [ticketsToUsers.ticketID],
      references: [tickets.id],
    }),
    user: one(userCommonData, {
      fields: [ticketsToUsers.userID],
      references: [userCommonData.clerkID],
    }),
  }));

  const chatsToUserRelations = relations(chatsToUsers, ({ one }) => ({
    chat: one(chats, {
      fields: [chatsToUsers.chatID],
      references: [chats.id],
    }),
    user: one(userCommonData, {
      fields: [chatsToUsers.userID],
      references: [userCommonData.clerkID],
    }),
  }));

  return {
    // tables
    userCommonData,
    userHackerData,
    events,
    files,
    scans,
    errorLog,
    discordVerification,
    tickets,
    chats,
    chatMessages,
    ticketsToUsers,
    chatsToUsers,
    // relations
    userCommonRelations,
    userHackerRelations,
    eventsRelations,
    filesRelations,
    scansRelations,
    ticketRelations,
    chatRelations,
    chatMessageRelations,
    ticketsToUserRelations,
    chatsToUserRelations,
  };
}

// Ready-to-use schemas:
export const pgSchema = defineSchema("pg");
export const sqliteSchema = defineSchema("sqlite");
