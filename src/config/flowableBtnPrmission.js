// 工作流按钮权限控制
const DraftBtnPrmissionConfig = () => ({
  showTransferBtn: false,
  showSignBeforeBtn: false,
  showSignAfterBtn: false,
  showAgreeBtn: false,
  showDisagreeBtn: false,
  showSaveBtn: true,
  showSubmitBtn: true,
  showCopySendBtn: false,
  showRejectBtn: false,
  showRevokeBtn: false,
  showEmptyBtn: true,
  showDisuseBtn: true,
  showCloseBtn: true,
  showCommentBtn: false,
})
const DealPrmissionConfig = () => ({
  showTransferBtn: true,
  showSignBeforeBtn: true,
  showSignAfterBtn: true,
  showAgreeBtn: true,
  showDisagreeBtn: true,
  showSaveBtn: false,
  showSubmitBtn: false,
  showCopySendBtn: true,
  showRejectBtn: false,
  showRevokeBtn: false,
  showEmptyBtn: false,
  showDisuseBtn: false,
  showCloseBtn: true,
  showCommentBtn: true
})

export const DraftBtnPrmission = DraftBtnPrmissionConfig();
export const DealPrmission = DealPrmissionConfig();
