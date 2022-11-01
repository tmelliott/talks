import {
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  TableCellsIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

type Props = {
  type: "oneway" | "twoway";
  size?: [number, number];
};

const Structure = ({ type, size = [35, 70] }: Props) => {
  const [arrowSize, iconSize] = size;

  return (
    <>
      <div className="container relative mx-auto flex items-center justify-center gap-8">
        <TableCellsIcon height={iconSize} />
        <div>
          <ArrowsRightLeftIcon height={arrowSize} />
        </div>
        <div>
          <img
            src="/Rlogo.svg"
            alt="R Logo"
            height={iconSize}
            width={iconSize}
          />
        </div>
        <div>
          {type === "oneway" && <ArrowRightIcon height={arrowSize} />}
          {type === "twoway" && <ArrowsRightLeftIcon height={arrowSize} />}
        </div>
        <div>
          <img
            src="/ReactLogo.svg"
            alt="ReactJS Logo"
            height={iconSize}
            width={iconSize}
          />
        </div>
        <div>
          <ArrowsRightLeftIcon height={arrowSize} />
        </div>
        <UsersIcon height={iconSize} />
      </div>
    </>
  );
};

export default Structure;
