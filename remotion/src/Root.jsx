import { Composition } from 'remotion';
import { RealmAscension, realmAscensionSchema } from './compositions/RealmAscension.jsx';
import { StrikeBurst, strikeBurstSchema } from './compositions/StrikeBurst.jsx';
import { DailyRecap, dailyRecapSchema } from './compositions/DailyRecap.jsx';
import { VowDeclaration, vowDeclarationSchema } from './compositions/VowDeclaration.jsx';
import { VoidEntityShowcase, voidEntityShowcaseSchema } from './compositions/VoidEntityShowcase.jsx';
import { StreakMilestone, streakMilestoneSchema } from './compositions/StreakMilestone.jsx';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="RealmAscension"
        component={RealmAscension}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={realmAscensionSchema}
      />
      <Composition
        id="StrikeBurst"
        component={StrikeBurst}
        durationInFrames={75}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={strikeBurstSchema}
      />
      <Composition
        id="DailyRecap"
        component={DailyRecap}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={dailyRecapSchema}
      />
      <Composition
        id="VowDeclaration"
        component={VowDeclaration}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={vowDeclarationSchema}
      />
      <Composition
        id="VoidEntityShowcase"
        component={VoidEntityShowcase}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={voidEntityShowcaseSchema}
      />
      <Composition
        id="StreakMilestone"
        component={StreakMilestone}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={streakMilestoneSchema}
      />
    </>
  );
};
