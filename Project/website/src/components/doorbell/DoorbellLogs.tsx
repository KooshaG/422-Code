import { DoorbellLog } from "@prisma/client";

interface DoorbellLogProps {
  logs: DoorbellLog[]
}

export default async function DoorbellLogs(props: DoorbellLogProps) {

const logs = props.logs.sort((a,b) => b.time.getTime() - a.time.getTime())

  if (logs.length === 0) {
    return (
      <span className="text-xl">This doorbell hasn&apos;t been rung yet...</span>
    )
  }

  return (
    <table className='table table-pin-cols overflow-x-auto -z-10'>
      <thead>
        <tr>
          <th>Log ID</th>
          <th>Time Event Occured</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => {
          return <tr key={log.id} className='hover'>
            <td>{log.id ?? "null"}</td>
            <td>{log.time.toLocaleDateString([], {weekday: 'long', month: 'long', day: '2-digit', hour: "numeric", minute: "2-digit", second: "2-digit"}) ?? "null"}</td>
            <td>{log.message}</td>
          </tr>;
        })}
      </tbody>
    </table>
  )
}