import { prisma } from "@/prismaClient";
import { randomInt } from "crypto";

export const dynamic = 'force-dynamic' // defaults to force-static


export async function GET(request: Request) {
  var found = true;
    var code = randomInt(1,10000);
    while (found) {
      code = randomInt(1,10000);
      const bell = await prisma.doorbell.findUnique({ 
        where: {
          registrationCode: code
        }
      })
      found = !!bell;
    }

    const newDoorbell = await prisma.doorbell.create({
      data: {
        registrationCode: code
      }
    })

    return Response.json({registrationCode: code, id: newDoorbell.id});
}