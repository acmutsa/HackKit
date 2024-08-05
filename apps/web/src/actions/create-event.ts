'use server';
import { adminAction } from "@/lib/safe-action";
import { newEventSchema } from "@/validators/shared/newEvent";
import { eventInsertType } from "@/lib/types/events";
import { createEventStatement } from "@/lib/queries/events";

export const createEvent = adminAction(
	newEventSchema,
	async (
    eventDetails: eventInsertType,
	) => {
    try{
      const eventID = await createEventStatement(eventDetails);
    }
    catch(e){
      console.log(e);
      return {
        success: false,
      };
    }
  },
); 