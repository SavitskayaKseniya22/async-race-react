import Navigation from "./Navigation";
import ControlPanel from "./ControlPanel";
import Title from "./Title";

export default function Header() {
  return (
    <header className="flex h-[170px] flex-col justify-between bg-slate-300 p-4 text-white">
      <Navigation></Navigation>

      <h1 className="ml-20 mt-auto text-6xl">Async race</h1>
      <Title></Title>
      <ControlPanel></ControlPanel>
    </header>
  );
}
