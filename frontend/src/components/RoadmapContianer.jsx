import { useLoaderData } from "react-router-dom";
import FitMapList from "./RoadmapList";

const RoadmapContainer = () => {
  const { pagination } = useLoaderData();
  let roadmapCount = pagination.totalCount;

  return (
    <>
      <div className="font-medium text-md">
        Total {roadmapCount > 1 && "Roadmaps"} {roadmapCount}
      </div>
      {roadmapCount === 0 ? (
        <h5 className="text-2xl mt-16">
          "Sorry, no personalized roadmaps matched your criteria..."
        </h5>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Your Personalized Roadmaps
          </h3>
          <FitMapList />
        </div>
      )}
    </>
  );
};

export default RoadmapContainer;
