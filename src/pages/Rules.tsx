import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import { Hunt, Rule } from "../types";
import HuntNav from "../components/HuntNav";
import Loading from "../utils/Loading";

const Rules: React.FC = () => {
  const { slug } = useParams();

  const [hunt, setHunt] = useState<Hunt>();
  const [rules, setRules] = useState<Rule[]>();

  const [rulesLoading, setRulesLoading] = useState<boolean>(false);
  const [huntLoading, setHuntLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = `Rules | ${hunt ? `${hunt.name} | ` : ""}TreasureKoii`;

    const getHuntDetails = async (): Promise<void> => {
      setRulesLoading(true);
      try {
        const response = await axios.get(`hunt/${slug}/`);
        const data = response.data;
        if (response.status === 200) {
          setHunt(data);
        }
        // console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setRulesLoading(false);
      }
    };

    const getRules = async (): Promise<void> => {
      setHuntLoading(true);
      try {
        const response = await axios.get(`${slug}/get-rules/`);
        const data = response.data;
        if (response.status === 200) {
          setRules(data);
        }
        // console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setHuntLoading(false);
      }
    };

    getHuntDetails();
    getRules();

    return () => {
      document.title = "TreasureKoii";
    };
  }, [slug]);
  return (
    <div>
      {(huntLoading || rulesLoading) && <Loading />}
      <HuntNav slug={slug} huntName={hunt?.name} />

      {rules?.length !== 0 && (
        <div className="">
          <p className="text-5">Rules</p>
          <p className="text-3 lg:px-60">
            We expect that you follow a set a of ruless. The organizers have
            complete authority to add, delete and/or change any rule at any
            given time.
          </p>
          <div className="styled-div-1">
            {rules?.map((rule, index) => (
              <div key={rule.id}>
                <p className="text-1 text-left">
                  {index + 1} - {rule.rule}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {rules?.length === 0 && <p className="text-4 p-4">No rules yet.</p>}
    </div>
  );
};

export default Rules;
