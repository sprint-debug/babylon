export interface IAlertPopup {
  titleText?: string | JSX.Element;
  contentText?: string | JSX.Element;
}

export interface IConfirmPopup {
  titleText?: string | JSX.Element;
  contentText?: string | JSX.Element;
  onConfirm?: () => void;
}
