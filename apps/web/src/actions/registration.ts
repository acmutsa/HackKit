"use server"
import { authenticatedAction } from "@/lib/safe-action"
import { db,sql } from "db"
import { put } from "@vercel/blob"
import { bucketResumeBaseUploadUrl } from "config"
import z from "zod"
import { returnValidationErrors } from "next-safe-action"
import { updateUserResume } from "db/functions"
import { hackerRegistrationFormValidator } from "@/validators/shared/registration"
import { getUser,getUserByTag } from "db/functions"
import { userCommonData, userHackerData } from "db/schema"
import { currentUser } from "@clerk/nextjs/server"
import c from "config"

const uploadResumeSchema = z.object({
  resumeFile:z.any()
});

const registerUserSchema = hackerRegistrationFormValidator.merge(
	uploadResumeSchema
);


export const uploadResume = authenticatedAction
  .schema(uploadResumeSchema).
  action(
    async ({ ctx:{ userId}, parsedInput:{resumeFile} }) =>{
      if (!(resumeFile instanceof File)){
        returnValidationErrors(z.null(),{ _errors:["Type Provided is not a file"]})
      }
    const fileLocation = `${bucketResumeBaseUploadUrl}/${resumeFile.name}`;
    const newBlob = await put(fileLocation, resumeFile, {
      access: "public",
    });

    await updateUserResume(userId,newBlob.url);

      return {
        success:true,
        resume_url:newBlob.url
      }
    }
);

export const registerUser = authenticatedAction
  .schema(registerUserSchema)
  .action(
    async ( { ctx:{ userId }, parsedInput}) =>{
      const { resumeFile, 
        university,major,schoolID,levelOfStudy,hackathonsAttended,softwareExperience, heardFrom,GitHub,LinkedIn,PersonalWebsite,resume,hasAcceptedMLHCoC,hasSharedDataWithMLH,isEmailable,
        ...userData
      }  = parsedInput;
      
      const lookupByUserID = await getUser(userId);

      if (lookupByUserID){
        return {
			    success: false,
			    message: "You are already registered.",
		    };
      }

      const lookupByHackerTag = await getUserByTag(
			 userData.hackerTag.toLowerCase()
		  );

      if (lookupByHackerTag) {
        return {
          success: false,
				  message: "hackertag_not_unique",
        }
      }

      const totalUserCount = await db
			.select({ count: sql<number>`count(*)`.mapWith(Number) })
			.from(userCommonData);
      
      const currUser = await currentUser();

      if (!currUser){
        returnValidationErrors(z.null(), {
			  _errors: ["User does not exist"],
		});
      }

      const res = await db.transaction(async (tx)=>{
      //  Add user common insertion
        const [resUserData] = await tx.insert(userCommonData).values({
          clerkID: userId,
          ...userData,
          profilePhoto: currUser.imageUrl,
          skills: userData.skills.map((v) => v.text.toLowerCase()),
          isFullyRegistered:true,
          // Come back and change this later
          dietRestrictions:userData.dietRestrictions
        }).returning({userCommonDataId:userCommonData.clerkID});

        const [resHackerData] = await tx.insert(userHackerData).values({
          clerkID: userId,
          university,
          major,
          schoolID,
          levelOfStudy,
          hackathonsAttended,
          softwareExperience,
          heardFrom,
          GitHub,
          LinkedIn,
          PersonalWebsite,
          resume,
          group: totalUserCount[0].count % Object.keys(c.groups).length,
          hasAcceptedMLHCoC,
          hasSharedDataWithMLH,
          isEmailable,
        }).returning({userHackerDataId:userHackerData.clerkID});

        return [resUserData.userCommonDataId,resHackerData.userHackerDataId]
      });

      if (res.length < 2){
        return{
          success:false,
          message:"There was an error creating your registration. Please try again later."
        }
      }

      // Determine upload stuff

    }
  )



