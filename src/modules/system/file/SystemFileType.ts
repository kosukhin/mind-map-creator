import { GuestType } from '@/modules/system/guest/GuestType';

export interface SystemFileType {
  content(target: GuestType<string>): this;
}
