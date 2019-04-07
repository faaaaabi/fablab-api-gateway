import { actor } from "types/actor";

export default interface ActorService {
  toggleActorState(actor: actor): Promise<void>;
  switchOnActor(actor: actor): Promise<boolean>;
  switchOffActor(actor: actor): Promise<boolean>;
  getActorState(actor: actor): Promise<string>
  getIdentifier(): string;
}