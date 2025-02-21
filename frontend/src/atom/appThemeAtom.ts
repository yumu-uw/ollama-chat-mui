import type { AppThemeModel } from "@/model/configModel";
import { atom } from "jotai";

export const appThemeAtom = atom<AppThemeModel>(
	document.body.getAttribute("data-theme") as AppThemeModel,
);
