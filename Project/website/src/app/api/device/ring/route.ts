import { prisma } from "@/prismaClient";
import { randomInt } from "crypto";
import { type NextRequest } from "next/server";

export const dynamic = 'force-dynamic' // defaults to force-static


export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return Response.json("no id", { status:400 })
  }
  const doorbell = await prisma.doorbell.findUnique({
    where: { id: parseInt(id) },
  })
  if (!doorbell) {
    return Response.json("no doorbell", { status:400 })
  }
  if (doorbell.silentStart === null || doorbell.silentEnd === null) {
    await prisma.doorbellLog.create({
      data: {
        message: "Doorbell sucessfully rang",
        doorbell: {
          connect: {
            id: doorbell.id
          }
        }
      },
    })
    return Response.json("", {status: 200})
  }
  const [startTimeHour, startTimeMinute] = doorbell.silentStart.split(':').map(x => parseInt(x))
  const [endTimeHour, endTimeMinute] = doorbell.silentEnd.split(':').map(x => parseInt(x))
  const currentTime = new Date(Date.now())
  // const currentTime = new Date(Date.now() - (5 * 60 * 60 * 1000)) // timezone offset
  const currentTimeHour = currentTime.getHours()
  const currentTimeMinute = currentTime.getMinutes()

  console.log(startTimeHour, startTimeMinute)
  console.log(endTimeHour, endTimeMinute)
  console.log(currentTimeHour, currentTimeMinute)
  // determine if start time is before end time
  // if yes, just need to check if current time is between start and end time
  // if not, do opposite

  





  return Response.json("", {status: 200})
}