import {
  EItemCategory1Depth,
  EItemCategory2Depth,
  EItemCategory3Depth,
} from './EItemCategory';
import {
  ICategory,
  IMainCategory,
  ISubCategory,
} from './useCategoryType';

/** Todo:
 * CDN에 json 프리셋이 올라가서 해당 파일 다운로드에서 사용예정.
 * 최초 다운로드 이후 IndexedDB 에 저장하여 캐싱
 */

export const superCategory: ICategory = EItemCategory1Depth;
export const mainCategory: IMainCategory = EItemCategory2Depth;
export const subCategory: ISubCategory = EItemCategory3Depth;

export let avaCategory: ISubCategory = {};
Object.entries(subCategory).map(ctgr => {
  const ctgrKey = Number(ctgr[0]);
  if (ctgrKey < 20000) avaCategory[ctgr[0]] = ctgr[1];
});
avaCategory['10000'] = { Name: 'ALL', Text: '아바타 아이템 전체', Desc: '', Parent: '', ActiveIcon: 'accSelectedIcon.svg', InActiveIcon: 'accNormalIcon.svg', IsShowShop: true }

export let skinCategory: ISubCategory = {};
Object.entries(subCategory).map(ctgr => {
  const ctgrKey = Number(ctgr[0]);
  if (ctgrKey >= 20000 && ctgrKey < 30000) skinCategory[ctgr[0]] = ctgr[1];
});
skinCategory['20000'] = { Name: 'ALL', Text: '스킨 전체', Desc: '', Parent: '', ActiveIcon: 'accSelectedIcon.svg', InActiveIcon: 'accNormalIcon.svg', IsShowShop: true }

export let itemCategory: ISubCategory = {};
Object.entries(subCategory).map(ctgr => {
  const ctgrKey = Number(ctgr[0]);
  if (ctgrKey >= 30000) itemCategory[ctgr[0]] = ctgr[1];
});
itemCategory['30000'] = { Name: 'ALL', Text: '아이템 전체', Desc: '', Parent: '', ActiveIcon: 'accSelectedIcon.svg', InActiveIcon: 'accNormalIcon.svg', IsShowShop: true }

