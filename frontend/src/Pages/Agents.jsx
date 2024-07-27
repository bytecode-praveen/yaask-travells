import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAgents } from "../redux/actions/userActions";


const Agents = () => {
  const [isLoading, setIsLoading] = useState(true);

  const data = useSelector((state) => state.user?.agents);
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    async function getListingData() {
      await dispatch(getAgents());
      setIsLoading(false);
    }
    getListingData();
  }, [dispatch]);


 

  return (
    <main className="max-w-screen-xl xl:px-12 mx-auto py-7 px-5 sm:px-16 md:px-8">
      <section className=" flex flex-col-reverse md:flex-col gap-7">
      <ul className="agent-list">
        {data?.agents?.map((agent, index) => (
          <li key={index} className="agent-item">
            <p><strong>Email:</strong> {agent.emailId}</p>
            <p><strong>PAN:</strong> {agent.panNo ? agent.panNo : 'N/A'}</p>
            <p><strong>GST:</strong> {agent.gstNo ? agent.gstNo : 'N/A'}</p>
            <p><strong>Role:</strong> { agent.emailId?.split('@')[1]=='hotelbox.in'? ("Admin") : ("Agent")} </p> 
          </li>
        ))}
      </ul>
      </section>
    </main>
  );
};

export default Agents;
