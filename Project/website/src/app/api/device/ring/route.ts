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
    await makeLog(doorbell.id, true)
    return Response.json("", {status: 200})
  }
  const [startTimeHour, startTimeMinute] = doorbell.silentStart.split(':').map(x => parseInt(x))
  var [endTimeHour, endTimeMinute] = doorbell.silentEnd.split(':').map(x => parseInt(x))
  const currentTime = new Date(Date.now())
  // const currentTime = new Date(Date.now() - (5 * 60 * 60 * 1000)) // timezone offset
  var currentTimeHour = currentTime.getHours()
  const currentTimeMinute = currentTime.getMinutes()

  var endIsBefore = false;

  if (startTimeHour === endTimeHour && startTimeMinute === endTimeMinute){ // time is same
    if (currentTimeHour === endTimeHour && currentTimeMinute === endTimeMinute){
      return Response.json("in time", {status: 200})
    }
    return Response.json("not in silent time", {status: 400})
  }

  if (startTimeHour === endTimeHour){
    if (startTimeMinute < endTimeMinute){
      endIsBefore = false;
    }
    if (startTimeMinute > endTimeMinute){
      endIsBefore = true;
    }
  }
  if (startTimeHour < endTimeHour){
    endIsBefore = false;
  }
  if (startTimeHour > endTimeHour){
    endIsBefore = true;
  }
  if (endIsBefore) {
    if (endTimeHour >= currentTimeHour) {
      currentTimeHour += 24
    }
    endTimeHour += 24 // put to next day
  }

  if (startTimeHour === endTimeHour) {
    // check if current minute is after start and before end
    if (startTimeMinute < currentTimeMinute && currentTimeMinute < endTimeMinute) {
      await makeLog(doorbell.id, true)
      return Response.json("yes1", {status: 200})
    }
    else {
      await makeLog(doorbell.id, false)
      return Response.json("oops", {status: 400})
    }
  }
  if (currentTimeHour === startTimeHour) {
    if (currentTimeMinute >= startTimeMinute){
      await makeLog(doorbell.id, true)
      return Response.json("yes3", {status: 200}) 
    }
    await makeLog(doorbell.id, false)
    return Response.json("no1", {status: 400})
  }
  if (currentTimeHour === endTimeHour) {
    if (currentTimeMinute <= endTimeMinute) {
      await makeLog(doorbell.id, true)
      return Response.json("yes4", {status: 200})
    }
    await makeLog(doorbell.id, false)
    return Response.json("no2", {status: 400})
  }
  if (currentTimeHour > startTimeHour && currentTimeHour < endTimeHour) {
    // time is between :)
    await makeLog(doorbell.id, true)
    return Response.json("yes2", {status: 200})
  }
  await makeLog(doorbell.id, false)
  return Response.json("no way", {status: 400})
}

const makeLog = async (doorbellId: number, success: boolean) => {
  const message = success ? "Doorbell sucessfully rang" : "Doorbell rang but was dismissed because quiet mode was enabled"
  return await prisma.doorbellLog.create({
    data: {
      message: message,
      doorbell: {
        connect: {
          id: doorbellId
        }
      }
    },
  })
}