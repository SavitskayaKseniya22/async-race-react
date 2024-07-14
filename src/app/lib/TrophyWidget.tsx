import { TrophyIcon } from "@heroicons/react/16/solid";

export default function TrophyWidget({ wins }: { wins: number }) {
  return (
    <div className="flex items-center gap-1">
      <TrophyIcon className="w-10 text-orange-300"></TrophyIcon>
      <span className="text-xl font-bold">{wins}</span>
    </div>
  );
}
