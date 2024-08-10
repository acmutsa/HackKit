'use server';
import { adminAction } from "@/lib/safe-action";
import { newEventFormSchema } from "@/validators/event";
import { eventInsertType } from "@/lib/types/events";
import { createNewEvent } from "@/lib/queries/events";

export const createEvent = adminAction(
	newEventFormSchema,
	async (
    eventDetails: eventInsertType,
	) => {
    try{
      const eventID = await createNewEvent(eventDetails);
    }
    catch(e){
      console.log(e);
      return {
        success: false,
      };
    }
  },
); 