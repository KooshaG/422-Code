"use client";

import { api } from '@/trpc/client'
import { type Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

interface DoorbellPairProps {
  session: Session
}

export default function DoorbellPair(props: DoorbellPairProps) {
const router = useRouter();

  const [code, setCode] = useState(0)
  const [submitting, setSubmitting] = useState<boolean>(false);
  const utils = api.useUtils();

  const updateDoorbell = api.doorbell.pair.useMutation({
    onMutate: () => {
      setSubmitting(true);
    },
    onSuccess: (res) => {
      setSubmitting(false);
      utils.doorbell.invalidate();
      router.push(`/doorbells/${res.id}`)
    },
  })

  const handleEdit = () => {
    if (!props.session.user.id) return
    updateDoorbell.mutate({
      registrationCode: code,
      userId: props.session.user.id
    })
  }
  

  return (
    <div className="form-control w-full items-center gap-6">
      <div>
        <label className="label">
          <span className="label-text">Registration Code</span>
        </label>
        <input type="number" className='input input-bordered' value={code} onChange={(e) => {setCode(parseInt(e.target.value))}}>
        </input>
      </div>
      <button className="btn btn-secondary" disabled={submitting} onClick={handleEdit}>
        Add Doorbell
      </button>

    </div>
  )
}