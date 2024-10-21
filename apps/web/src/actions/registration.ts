"use server"
import { authenticatedAction } from "@/lib/safe-action"
import { db,sql } from "db"
import { put } from "@vercel/blob"
import { bucketResumeBaseUploadUrl } from "config"
import z from "zod"
import { returnValidationErrors } from "next-safe-action"
import { updateUserResume } from "db/functions"
import { hackerRegistrationFormValidator } from "@/validators/shared/registration"
import { userCommonData, userHackerData } from "db/schema"
import { currentUser } from "@clerk/nextjs/server"
import c from "config"
import { DatabaseError } from "db/types"
import { DUPLICATE_KEY_ERROR_CODE,UNIQUE_KEY_MAPPER_DEFAULT_KEY } from "@/lib/constants"


const uploadResumeSchema = z.object({
	resumeFile: z.any()
    // .instanceof(File, { message: "Required" })
    // .refine((file) => file.size > 0, "Required"),
});

const registerUserSchema = hackerRegistrationFormValidator;


export const uploadResume = authenticatedAction
  .schema(uploadResumeSchema).
  action(
    async ({ ctx:{ userId}, parsedInput:{resumeFile} }) =>{
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
      // Reccomended: Destructure out your unique constraints / primary keys ahead of time to ensure that they can be cause short circuit logic if a unique constraint is violated
      const { resumeFile, hackerTag, email,
        university,major,schoolID,levelOfStudy,hackathonsAttended,softwareExperience, heardFrom,GitHub,LinkedIn,PersonalWebsite,resume,hasAcceptedMLHCoC,hasSharedDataWithMLH,isEmailable,
        ...userData
      }  = parsedInput;

      const currUser = await currentUser();

		if (!currUser) {
			returnValidationErrors(z.null(), {
				_errors: ["User does not exist"],
			});
		}
      const totalUserCount = await db
			.select({ count: sql<number>`count(*)`.mapWith(Number) })
			.from(userCommonData);
      
      try{
        await db.transaction(async (tx) => {
        //  Add user common insertion
          await tx.insert(userCommonData).values({
				// Slight optimization to short circuit is to add all of your unique keys at the top
				clerkID: userId,
				hackerTag: hackerTag.toLocaleLowerCase(),
				email,
				...userData,
				profilePhoto: currUser.imageUrl,
				skills: userData.skills.map((v) => v.text.toLowerCase()),
				isFullyRegistered: true,
				dietRestrictions: userData.dietRestrictions,
			});

          await tx
            .insert(userHackerData)
            .values({
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
              group:
                totalUserCount[0].count % Object.keys(c.groups).length,
              hasAcceptedMLHCoC,
              hasSharedDataWithMLH,
              isEmailable,
            })
      });
      }catch(e){
        // Catch duplicates because they will be based off of the error code 23505
        if (e instanceof DatabaseError && e.code  === DUPLICATE_KEY_ERROR_CODE){
          console.error(e);
          const constraintKeyIndex = e.constraint as keyof typeof c.db.UniqueKeyMapper;
          return {
				success: false,
				message: c.db.UniqueKeyMapper[constraintKeyIndex  ?? UNIQUE_KEY_MAPPER_DEFAULT_KEY] ?? e.detail,
			};
        }else{
          throw e;
        }
      }
      console.log('Contents of resumeFile',resumeFile);
      // Determine upload stuff
      // if (resumeFile){
      //   console.log("Uploading blob");
      //   const res = await uploadResume({resumeFile});
      //   if (res?.serverError){
      //     return {
			// 	success: true,
			// 	message:
			// 		"Registration created successfully but there was an error uploading your resume.",
			// };
      //   }
      // console.log("Success posting");
      // }

      return {
        success:true,
        message:"Registration created successfully"
      }

    }
  )



