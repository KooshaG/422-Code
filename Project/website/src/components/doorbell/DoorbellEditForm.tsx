"use client";

import { api } from '@/trpc/client'
import { type Doorbell } from '@prisma/client';
import { type Session } from 'next-auth';
import { useRef, useState } from 'react';

interface DoorbellEditProps {
  doorbell: Doorbell
  session: Session
}

export default function DoorbellEditForm(props: DoorbellEditProps){
  const [startTime, setStartTime] = useState(props.doorbell.silentStart ?? "00:00")
  const [endTime, setEndTime] = useState(props.doorbell.silentEnd ?? "00:00")
  const [enableSilent, setEnableSilent] = useState(!!props.doorbell.silentEnd && !!props.doorbell.silentEnd)
  const [name, setName] = useState(props.doorbell.name)
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  const timeoutID = useRef<NodeJS.Timeout>();

  const utils = api.useUtils()

  const updateDoorbell = api.doorbell.update.useMutation({
    onMutate: () => {
      setSubmitting(true);
    },
    onSuccess: () => {
      setSubmitting(false);
      if (timeoutID.current) {
        clearTimeout(timeoutID.current);
      }
      setToastVisible(true);
      timeoutID.current = setTimeout(() => setToastVisible(false), 2000);
      utils.doorbell.invalidate();
    },
  })

  const handleEdit = () => {
    const values = {
      id: props.doorbell.id,
      name: name,
      silentStart: enableSilent ? startTime : null,
      silentEnd: enableSilent ? endTime : null
    }
    updateDoorbell.mutate(values)
  }
  

  return (
    <div className="form-control w-full items-center gap-6">
      <div className="flex flex-row justify-center gap-4">
        <div className='flex flex-col items-center gap-2'>
          <label className="cursor-pointer label">
            <span className="label-text">Enable Quiet Mode</span> 
          </label>
          <input type="checkbox" className="toggle toggle-secondary" checked={enableSilent} onChange={(e) => setEnableSilent(curr => !curr)} />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Start Time</span>
          </label>
          <input type="time" className='input input-bordered' disabled={!enableSilent} value={startTime || "00:00"} onChange={(e) => {setStartTime(e.target.value)}}>
          </input>
        </div>
        <div>
          <label className="label">
            <span className="label-text">End Time</span>
          </label>
          <input type="time" className='input input-bordered' disabled={!enableSilent} value={endTime || "00:00"} onChange={(e) => {setEndTime(e.target.value)}}>
          </input>
        </div>
      </div>
      <div>
        <label className="label">
          <span className="label-text">Doorbell Name</span>
        </label>
        <input type="text" placeholder="Doorbell" value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered w-full max-w-md" />
      </div>
      
      <button className="btn btn-secondary" disabled={submitting} onClick={handleEdit}>
        Save Changes
      </button>

      <div className={`toast ${toastVisible ? "" : "hidden"}`}>
        <div className="alert alert-success">
          <span>Settings saved successfully!</span>
        </div>
      </div>
    </div>
  )


}