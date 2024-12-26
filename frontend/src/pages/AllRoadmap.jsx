import { Pagination, Filter, RoadmapContianer } from "../components";
import axiosInstance from "../utils/api/axiosInstance";

export const loader = async ({ request }) => {
  const urlSearchParams = new URLSearchParams(request.url.split("?")[1]);
  const params = Object.fromEntries(urlSearchParams.entries());

  const response = await axiosInstance.get("/roadmaps", {
    params,
  });
  // console.log(response);
  const roadmap = response.data.roadmaps;
  const pagination = response.data.pagination;
  return { roadmap, pagination };
};

const AllRoadmap = () => {
  return (
    <div>
      <Filter />
      <RoadmapContianer />
      <Pagination />
    </div>
  );
};
export default AllRoadmap;
