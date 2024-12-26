import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
      <div>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
          "Empower Your Future with AI Career Guidance"
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-8">
          "Welcome to AI Career Navigator – your personalized guide to exploring
          AI-driven career paths, mastering skills, and achieving your
          professional goals."
        </p>
      </div>
      <div className="hidden h-[28rem] lg:carousel carousel-center p-4 space-x-4 bg-neutral-300 rounded-box">
        <div className="flex w-full flex-col justify-evenly border-opacity-50">
          <div
            className="card bg-base-300 rounded-box grid h-40 place-items-center"
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/originals/bd/0a/24/bd0a243999c3a30bd19933a7ac491dcf.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Link to="/Career" className="btn btn-primary">
              Career Choice
            </Link>
          </div>
          <div className="divider divider-primary"></div>
          <div
            className="card bg-base-300 rounded-box grid h-40 place-items-center"
            style={{
              backgroundImage: `url('https://as2.ftcdn.net/v2/jpg/02/15/64/97/1000_F_215649743_jm9iOoLsBa6Jr02WfkMfkJZDMClNsySR.jpg')`, // Use the imported image here
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Link to="/ai-chat" className="btn btn-success">
              Personalized AI Teacher
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
