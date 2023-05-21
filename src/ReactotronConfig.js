import Reactotron from "reactotron-react-js";

Reactotron.configure({ host: "192.168.10.31", secure: true }) // we can use plugins here -- more on this later
  .connect(); // let's connect!
