import React from "react";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("./Header"), {
  ssr: false,
});

const Footer = dynamic(() => import("./Footer"), {
  ssr: false, 
});


const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
