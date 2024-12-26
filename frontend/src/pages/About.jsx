import about1 from "../assets/Images/About1.jpg";
import about2 from "../assets/Images/about2.jpg";
import about3 from "../assets/Images/about3.jpeg";
import about4 from "../assets/Images/about4.jpg";

const About = () => {
  const images = [about4, about1, about2, about3];

  return (
    <div className="flex gap-28">
      {/* Carousel Section */}
      <div className="carousel carousel-center bg-neutral rounded-box max-w-md space-x-4 p-4 max-h-96">
        {images.map((image, index) => (
          <div key={index} className="carousel-item  w-80 h-96">
            <img
              src={image}
              alt={`Carousel Image ${index + 1}`}
              className="w-full h-full object-cover rounded-box"
            />
          </div>
        ))}
      </div>

      {/* Text and Description Section */}
      <div>
        <div className="flex flex-wrap gap-2 sm:gap-x-6 item-center justify-center">
          <h1 className="text-4xl font-bold leading-none tracking-tight sm:text-6xl">
            Welcome to
          </h1>
          <div className="stats bg-primary shadow">
            <div className="stat">
              <div className="stat-title text-primary-content text-4xl font-bold tracking-wide">
                Pathfinder AI
              </div>
            </div>
          </div>
        </div>
        <p className="mt-6 text-lg leading-8 max-w-2xl mx-auto">
          <span className="text-accent">Pathfinder AI</span> , your gateway to
          intelligent solutions powered by cutting-edge technology. We
          specialize in creating innovative AI-driven tools designed to simplify
          your journey and help you achieve your goals effectively. At
          <br />
          <span className="text-accent">Pathfinder AI</span>, we guide you
          toward smarter decisions and brighter outcomes. Let’s embark on this
          journey together!
        </p>
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-primary">
            Why Choose Pathfinder AI?
          </h2>
          <div className="flex flex-wrap gap-8 justify-center mt-6">
            <div className="flex items-center">
              <div className="text-3xl text-primary">🎯</div>
              <p className="ml-2 text-lg font-medium">Tailored Roadmaps</p>
            </div>
            <div className="flex items-center">
              <div className="text-3xl text-primary">💪</div>
              <p className="ml-2 text-lg font-medium">Expert Guidance</p>
            </div>
            <div className="flex items-center">
              <div className="text-3xl text-primary">🤝</div>
              <p className="ml-2 text-lg font-medium">Supportive Community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
