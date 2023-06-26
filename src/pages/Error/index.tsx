import { useRouteError } from "react-router-dom";

const Error = () => {
  const err: any = useRouteError();
  return <div>
    Error
    <p>STATUS: {err.status}</p>
    <p>STATUS_TEXT: {err.statusText}</p>
    <p>STATUS_MSG: {err.data}</p>
  </div>
}

export default Error;