import { Outlet, useNavigation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Loader, Header, Navbar, Footer } from "../components/index";
import { StickyNotes } from "../components";

const HomeLayout = () => {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === "loading";

  return (
    <>
      <nav>
        <Header />
        <Navbar />

        {isPageLoading ? (
          <Loader />
        ) : (
          <section className="my-custom-style py-10">
            <Outlet />
          </section>
        )}
      </nav>
      <StickyNotes />
      <Footer />
    </>
  );
};

export default HomeLayout;
