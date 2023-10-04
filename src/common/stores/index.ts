import { atom } from 'jotai';
import { ISubCategory } from '../utils/json/useCategoryType';
import { IAlertPopup, IConfirmPopup } from './type';
//import { ICategory } from '../utils/json/useCategoryType';

export type AvatarUiMode = 'NONE' | 'ITEMLIST' | 'CODY' | 'OFFSET' | 'POSE';

/** BottomSheet 제어 */
export const avatarUiAtom = atom<AvatarUiMode>('ITEMLIST'); // 아바타 바텀 시트 ui 모드 제어;
export const screenRatioAtom = atom(1);
export const bottomHeightAtom = atom(window.innerHeight / 2); // bottomSheet 높이
export const bottomRefAtom = atom<any>(null);
export const uiHeightControlLockAtom = atom<boolean>(false);
// export const uiActiveMainCtgrIconAtom = atom((get) => {
//   const mainCtgrList = get(mainCtgrListAtom);
//   const currentCtgrKey = get(currentCtgrKeyAtom);
//   return mainCtgrList[currentCtgrKey[1]]?.EnumType;
// });
// export const uiActiveSubCtgrIconAtom = atom((get) => {
//   const subCtgrList = get(subCtgrListAtom);
//   const currentCtgrKey = get(currentCtgrKeyAtom);
//   return subCtgrList[currentCtgrKey[2]]?.EnumType ?? 'ALL';
// });

export const uiPlaceModeAtom = atom<boolean>(false);
export const uiSkinModeAtom = atom<boolean>(false);
export const uiBgColorOptionAtom = atom<boolean>(false);

/** 카테고리 데이터 제어  */
// export const superCtgrAtom = atom<ICategory>({});
// export const mainCtgrAtom = atom<ICategory>({});
// export const subCtgrAtom = atom<ISubCategory>({}); // 전체 서브카테고리
// export const avaCtgrAtom = atom<ISubCategory>({}); // 아바타 카테고리
// export const skinCtgrAtom = atom<ISubCategory>({}); // 룸 스킨 서브카테고리
// export const itemCtgrAtom = atom<ISubCategory>({}); // 아이템 서브카테고리

export const currentCtgrAtom = atom<ISubCategory>({}); // 현재 서브카테고리
export const currentCtgrKeyAtom = atom<string | number>('');
export const selectedItemAtom = atom<string>('');

/**팝업 */
export const alertPopupAtom = atom<IAlertPopup | null>(null);
export const confirmPopupAtom = atom<IConfirmPopup | null>(null);

