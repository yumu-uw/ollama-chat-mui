import type { CurrentOllamaHostModel } from "@/model/configModel";
import { atom } from "jotai";

export const currentOllamaHostAtom = atom<CurrentOllamaHostModel>();
