import {
  KraeplinScreenHeader,
  type KraeplinScreenHeaderProps,
} from "./kraeplin-screen-header";
import {
  KraeplinScreenNumpad,
  type KraeplinScreenNumpadProps,
} from "./kraeplin-screen-numpad";
import {
  KraeplinScreenRoller,
  type KraeplinScreenRollerProps,
} from "./kraeplin-screen-roller";

interface KraeplinScreenProps {
  header: KraeplinScreenHeaderProps;
  roller: KraeplinScreenRollerProps;
  numpad: KraeplinScreenNumpadProps;
}
export const KraeplinScreen = ({
  header,
  roller,
  numpad,
}: KraeplinScreenProps) => {
  return (
    <div className="relative flex h-[100dvh] w-full flex-col items-center justify-between">
      <KraeplinScreenHeader {...header} />
      <div className="relative flex h-full w-full items-center justify-center">
        <KraeplinScreenRoller {...roller} />
        {roller.up === 0 && roller.down !== 0 ? (
          <div className="text-destructive absolute bottom-0 w-full text-center font-semibold">
            Kamu mencapai batas baris
          </div>
        ) : null}
      </div>
      <KraeplinScreenNumpad {...numpad} />
    </div>
  );
};
