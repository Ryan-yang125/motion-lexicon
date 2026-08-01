import { canonicalMotionCatalog } from "../src/data/motion-catalog";
import { motionPacks } from "../src/data/motion-packs";
import {
  motionBlueprintExample,
  motionBlueprintContract,
  motionDirectorModes,
  motionGrammar,
  motionGrammarDataPath
} from "../src/data/motion-grammar";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const primitiveIds = new Set(canonicalMotionCatalog.map((entry) => entry.id));
const packIds = new Set<string>(motionPacks.map((pack) => pack.id));

assert(motionGrammar.version === "2.0.1", "Motion Grammar must carry the V2.0.1 version");
assert(motionGrammar.collections.primitives.count === canonicalMotionCatalog.length, "Motion Grammar primitive count is out of sync");
assert(motionGrammar.collections.moments.count === motionPacks.length, "Motion Grammar product-moment count is out of sync");
assert(motionGrammarDataPath === "/data/v2/motion-grammar.json", "Motion Grammar public data path changed unexpectedly");
assert(motionGrammar.invariants.length >= 6, "Motion Grammar needs the full interaction invariant set");
assert(motionGrammar.composition.primaryActorLimit === 1, "A Motion Blueprint needs one primary visual actor");
assert(motionGrammar.composition.auxiliaryActorLimit === 2, "A Motion Blueprint permits at most two auxiliary actors");
assert(motionGrammar.timing.arrive.rangeMs[0] >= 160 && motionGrammar.timing.arrive.rangeMs[1] <= 300, "Arrival timing must stay compact");
assert(motionGrammar.timing.leave.rangeMs[0] >= 100 && motionGrammar.timing.leave.rangeMs[1] <= 200, "Departure timing must stay compact");
assert(motionGrammar.timing.linear.curve === "linear", "Linear timing needs its explicit curve");
assert(motionGrammar.timing.spring.rangeMs[1] <= 360, "Spring timing must stay bounded");

const expectedModes = ["recommend", "compose", "implement", "review", "contribute"];
assert(
  JSON.stringify(motionDirectorModes.map((mode) => mode.id)) === JSON.stringify(expectedModes),
  "Motion Director modes must retain their stable order"
);

const actorIds = new Set(motionBlueprintExample.actors.map((actor) => actor.id));
assert(motionBlueprintExample.stateGraph.length >= 3, "Motion Blueprint needs a readable state graph");
assert(motionBlueprintExample.actors.filter((actor) => actor.role === "hero").length <= 1, "Motion Blueprint has too many primary visual actors");
assert(motionBlueprintExample.beats.length >= 2, "Motion Blueprint needs at least two meaningful beats");
assert(motionBlueprintExample.delivery.format.join(",") === "html,css,js", "Motion Blueprint delivery must stay portable");
assert(motionBlueprintExample.accessibility.keyboard.zh.length > 0, "Motion Blueprint needs keyboard guidance");
assert(motionBlueprintExample.accessibility.reducedMotion.zh.length > 0, "Motion Blueprint needs reduced-motion guidance");

for (const beat of motionBlueprintExample.beats) {
  assert(actorIds.has(beat.actorId), `Beat ${beat.at} refers to an unknown actor ${beat.actorId}`);
  assert(beat.durationMs >= 100 && beat.durationMs <= 300, `Beat ${beat.at} has an unsuitable duration`);
  for (const primitiveId of beat.primitiveIds) {
    assert(primitiveIds.has(primitiveId), `Beat ${beat.at} refers to unknown primitive ${primitiveId}`);
  }
}

for (const packId of motionBlueprintExample.provenance.relatedPacks) {
  assert(packIds.has(packId), `Motion Blueprint refers to unknown Product Moment ${packId}`);
}

for (const primitiveId of motionBlueprintExample.provenance.relatedPrimitives) {
  assert(primitiveIds.has(primitiveId), `Motion Blueprint provenance refers to unknown primitive ${primitiveId}`);
}

assert(motionBlueprintContract.version === "2.0", "Portable Motion Blueprint contract needs the V2 version");
assert(motionBlueprintContract.actors.filter((actor) => actor.role === "primary").length === 1, "Portable contract needs one primary actor");
assert(motionBlueprintContract.actors.length <= 3, "Portable contract has too many actors");
for (const actor of motionBlueprintContract.actors) {
  assert(
    motionBlueprintExample.actors.some((displayActor) => displayActor.id === actor.id && displayActor.role === actor.kind),
    `Portable contract actor ${actor.id} is missing its display semantic role`
  );
}
const contractStateIds = new Set(motionBlueprintContract.stateGraph.states.map((state) => state.id));
const contractActorIds = new Set(motionBlueprintContract.actors.map((actor) => actor.id));
assert(contractStateIds.has(motionBlueprintContract.stateGraph.initial), "Portable contract initial state is missing");
for (const transition of motionBlueprintContract.stateGraph.transitions) {
  assert(contractStateIds.has(transition.from), `Portable contract has unknown source state ${transition.from}`);
  assert(contractStateIds.has(transition.to), `Portable contract has unknown target state ${transition.to}`);
}
for (const beat of motionBlueprintContract.beats) {
  assert(contractActorIds.has(beat.actor), `Portable contract has unknown beat actor ${beat.actor}`);
  assert(primitiveIds.has(beat.primitive), `Portable contract has unknown primitive ${beat.primitive}`);
  assert(beat.durationMs >= 100 && beat.durationMs <= 300, `Portable contract beat ${beat.id} has an unsuitable duration`);
  assert(beat.easing in motionGrammar.timing, `Portable contract beat ${beat.id} uses an undocumented timing token`);
  assert(beat.properties.every((property) => ["transform", "opacity", "color", "clip", "progress"].includes(property)), `Portable contract beat ${beat.id} uses an unsupported property`);
}
for (const primitiveId of motionBlueprintContract.provenance.foundations) {
  assert(primitiveIds.has(primitiveId), `Portable contract provenance refers to unknown primitive ${primitiveId}`);
}
for (const packId of motionBlueprintContract.provenance.moments) {
  assert(packIds.has(packId), `Portable contract provenance refers to unknown Product Moment ${packId}`);
}

console.log(
  `Motion Grammar check passed: ${canonicalMotionCatalog.length} primitives, ${motionPacks.length} product moments, ` +
    `${motionDirectorModes.length} director modes, and ${motionBlueprintExample.beats.length} validated beats.`
);
