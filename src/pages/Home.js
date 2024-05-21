import supabase from "../config/supabaseClient";
import { useCallback, useEffect, useState } from "react";
import SmoothieCard from "../components/SmoothieCard";

const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [smoothies, setSmoothies] = useState(null);
  const [orderBy, setOrderBy] = useState("created_at");
  const [isOrderAscending, setIsOrderAscending] = useState(false);

  const fetchSmoothies = useCallback(async () => {
    const { data, error } = await supabase
      .from("smoothies")
      .select()
      .order(orderBy, { ascending: isOrderAscending });

    if (error) {
      setFetchError("Could not fetch the smoothies.");
      setSmoothies(null);
      console.log(error);
    }

    if (data) {
      setSmoothies(data);
      setFetchError(null);
    }
  }, [orderBy, isOrderAscending]);

  // On load, fetch the smoothies data
  useEffect(() => {
    fetchSmoothies();
  }, [orderBy, isOrderAscending, fetchSmoothies]);

  return (
    <div className="page home">
      {fetchError && <p>{fetchError}</p>}
      {smoothies && (
        <div className="smoothies">
          <div className="order-by">
            <p>Order by:</p>
            <button onClick={() => setOrderBy("title")}>Title</button>
            <button onClick={() => setOrderBy("rating")}>Rating</button>
            <button onClick={() => setOrderBy("created_at")}>
              Time Created
            </button>
            <span>
              <select
                className="ascending-select"
                onChange={(e) => {
                  setIsOrderAscending(e.target.value === "true");
                  console.log(e.target.value);
                }}
              >
                <option value={false}>Descending</option>
                <option value={true}>Ascending</option>
              </select>
            </span>
          </div>
          <div className="smoothie-grid">
            {smoothies.map((smoothie) => (
              <SmoothieCard
                key={smoothie.id}
                smoothie={smoothie}
                reloadData={fetchSmoothies}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
