import type { ConfigModel } from "@/model/configModel";
import { atom } from "jotai";

export const configAtom = atom<ConfigModel>();
