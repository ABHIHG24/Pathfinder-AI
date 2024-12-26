import { Link } from "react-router-dom";

const Filter = () => {
  return (
    <div className="p-4">
      <p className="text-lg font-semibold mb-4">Personalized AI Teacher</p>
      <div className="mb-4">
        <Link to="/ai-chat">
          <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out">
            Chat with AI Teacher
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Filter;
