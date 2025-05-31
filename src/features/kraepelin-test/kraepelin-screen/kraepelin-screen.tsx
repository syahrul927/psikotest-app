import {
  KraepelinScreenHeader,
  type KraepelinScreenHeaderProps,
} from "./header";
import {
  KraepelinScreenNumpad,
  type KraepelinScreenNumpadProps,
} from "./numpad";
import {
  KraepelinScreenRoller,
  type KraepelinScreenRollerProps,
} from "./roller";

interface KraepelinScreenProps {
  header: KraepelinScreenHeaderProps;
  roller: KraepelinScreenRollerProps;
  numpad: KraepelinScreenNumpadProps;
}
export const KraepelinScreen = ({
  header,
  roller,
  numpad,
}: KraepelinScreenProps) => {
  return (
    <div className="relative flex h-[100dvh] w-full flex-col items-center justify-between">
      <KraepelinScreenHeader {...header} />
      <div className="relative flex h-full w-full items-center justify-center">
        <KraepelinScreenRoller {...roller} />
        {roller.up === 0 && roller.down !== 0 ? (
          <div className="text-destructive absolute bottom-0 w-full text-center font-semibold">
            Kamu mencapai batas baris
          </div>
        ) : null}
      </div>
      <KraepelinScreenNumpad {...numpad} />
    </div>
  );
};
