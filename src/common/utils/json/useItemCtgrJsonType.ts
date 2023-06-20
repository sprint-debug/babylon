export interface ICategory {
  [id: string]: ICategoryData;
}
export interface ICategoryData {
  EnumType: string;
  Name: string;
  Desc: string;
  Parent: string;
  ActiveIcon: string;
  InActiveIcon: string;
}

/**
 * ISuper, IMain, ISub 카테고리 현재 미사용
 * 차후에 각 카테고리별 타입 달라질 경우 적용
 *  */
export interface ISuperCategory {
  [id: string]: ISuperCategoryData;
}
interface ISuperCategoryData extends ICategoryData {
  SuperCtgrSpecificProperty?: string;
}

export interface IMainCategory {
  [id: string]: IMainCategoryData;
}
interface IMainCategoryData extends ICategoryData {
  MainCtgrSpecificProperty?: string;
  IsShow?: boolean;
}

export interface ISubCategory {
  [id: string]: ISubCategoryData;
}
interface ISubCategoryData extends ICategoryData {
  SubCtgrSpecificProperty?: string;
  IsShowShop: boolean;
  Option?: string;
  HideWhenEquipped?: string;
}

// 예시
// export interface NpcTalkData {
//   [id: string | number]: NpcTalkValue;
// }
// interface NpcTalkValue {
//   NpcID: string | number;
//   EDialogType: string | number;
//   TextID: string | number;
//   '#Description': string;
//   ENextOrder: string | number;
//   NextStep: string | number;
//   Option: number | number[] | string | string[];
//   ActiveAction: number | string;
// }
