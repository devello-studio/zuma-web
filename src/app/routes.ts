import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Servicios } from "./components/Servicios";
import { Nosotros } from "./components/Nosotros";
import { Contacto } from "./components/Contacto";
import { LeadCapture } from "./components/LeadCapture";
import { ThankYou } from "./components/ThankYou";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "servicios", Component: Servicios },
      { path: "nosotros", Component: Nosotros },
      { path: "contacto", Component: Contacto },
      { path: "*", Component: NotFound },
    ],
  },
  // Landing pages outside navigation
  {
    path: "/consulta-gratuita",
    Component: LeadCapture,
  },
  {
    path: "/gracias",
    Component: ThankYou,
  },
]);