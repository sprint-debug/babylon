import {
  EItemCategory1Depth,
  EItemCategory2Depth,
  EItemCategory3Depth,
} from './EItemCategory';
import {
  ICategory,
  IMainCategory,
  ISubCategory,
} from './useItemCtgrJsonType';
import _ from 'lodash';

/** Todo:
 * CDN에 json 프리셋이 올라가서 해당 파일 다운로드에서 사용예정.
 * 최초 다운로드 이후 IndexedDB 에 저장하여 캐싱
 */

const useItemCtgrJson = () => {
  /** EItemCategory - Colorverse_enum 구글시트 참조
   * 1depth : 대분류
   * 2depth : 메인 카테고리
   * 3depth : 서브 카테고리 */
  const superCtgrOriginalJSON: ICategory = EItemCategory1Depth;
  const mainCtgrOriginalJSON: IMainCategory = EItemCategory2Depth;
  const subCtgrOriginalJSON: ISubCategory = EItemCategory3Depth;

  let superCtgrJSON = {};
  Object.entries(superCtgrOriginalJSON).map(ctgr => {
    if (
      ctgr[1].EnumType === 'AVATARPRESET' ||
      ctgr[1].EnumType === 'AVATARITEM'
    ) {
      superCtgrJSON = {
        ...superCtgrJSON,
        [ctgr[0]]: ctgr[1]
      };
    }
  });

  let mainCtgrJSON = {};
  Object.entries(mainCtgrOriginalJSON).map(ctgr => {
    if (ctgr[1].Parent === 'AVATARPRESET' || ctgr[1].Parent === 'AVATARITEM') {
      mainCtgrJSON = {
        ...superCtgrJSON,
        [ctgr[0]]: ctgr[1]
      };
    }
  });

  let subCtgrJSON = {};
  Object.entries(subCtgrOriginalJSON).map(ctgr => {
    const mainCtgrType = Object.values(mainCtgrJSON).map(
      (value: any) => value.EnumType,
    );
    if (
      mainCtgrType.includes(ctgr[1].Parent)
      // ctgr[1].Parent === 'BODY' ||
      // ctgr[1].Parent === 'CLOTHES' ||
      // ctgr[1].Parent === 'BEAUTY' ||
    ) {
      subCtgrJSON = {
        ...subCtgrJSON,
        [ctgr[0]]: ctgr[1]
      };
      // if (ctgr[1].Option === 'offset') offsetMenus.push(Number(ctgr[0]));
    }
  });

  console.log('useItemCtgr superCtgrJSON', superCtgrJSON);
  console.log('useItemCtgr mainCtgrJSON', mainCtgrJSON);
  console.log('useItemCtgr subCtgrJSON', subCtgrJSON);


  return {
    superCtgrJSON,
    mainCtgrJSON,
    subCtgrJSON
  };
};

// const createSelectionData = (mainCtgrJSON, subCtgrJSON) => {
//   const selectDataObject = {};
//   Object.keys(mainCtgrJSON).map(ctgr => {
//     selectDataObject[ctgr] = {
//       itemIdList: [],
//       currItemId: null,
//     };
//   });
//   Object.keys(subCtgrJSON).map(ctgr => {
//     selectDataObject[ctgr] = {
//       itemId: null,
//       hideCategory: subCtgrJSON[ctgr].HideWhenEquipped,
//     };
//   });
//   return selectDataObject;
// };


export default useItemCtgrJson;
