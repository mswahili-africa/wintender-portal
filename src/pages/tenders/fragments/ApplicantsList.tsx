import { useParams } from "react-router-dom";

export const ApplicantsList = () => {
    const tenderId = useParams().tenderId;
  return (
    <div>ApplicantsList <br /> {tenderId}</div>
  )
}

