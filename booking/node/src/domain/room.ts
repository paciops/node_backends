import { Value } from '.';

export interface Room {
  id: number;
  beds: number;
}

export interface RoomLogic {
  add(room: Room): Value<boolean>;
  get(id: Room['id'], options?: Record<string, string | undefined>): Value<Room | undefined>;
  reset(): Value<void>;
}
