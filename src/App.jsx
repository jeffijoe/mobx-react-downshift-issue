import MobX from "./MobX.jsx";
import Basic from "./Basic.jsx";

export default function App() {
  return (
    <div className="App">
      {location.search === "?mobx" ? <MobX /> : <Basic />}
    </div>
  );
}
