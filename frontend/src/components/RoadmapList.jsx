import { useLoaderData } from "react-router-dom";
import { Link } from "react-router-dom";

const RoadmapList = () => {
  const roadmap = useLoaderData();

  return (
    <div className="pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {roadmap.roadmap.map((map) => {
        const { _id, careerTitle, description, image } = map;

        const img = `${import.meta.env.VITE_API_BASE_URL}/image/${image}`;

        return (
          <Link
            to={`/Career/${_id}`}
            key={_id}
            className="card w-full shadow-xl hover:shadow-2xl transition duration-300"
          >
            <figure className="px-4 pt-4">
              <img
                src={img}
                alt={careerTitle}
                className="rounded-xl h-64 md:h-40 w-full object-cover"
              />
            </figure>
            <div className="card-body items-center text-center">
              <p className="text-secondary text-sm font-medium">
                Title: {careerTitle}
              </p>
              <h2 className="card-title capitalize tracking-wider">
                {description.slice(0, 50)}
                ...
              </h2>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RoadmapList;
