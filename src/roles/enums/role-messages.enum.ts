export enum RoleSuccessMessages {
  CREATED = "نقش ایجاد شد",
  FOUND = "نقش پیدا شد",
  LISTED = "لیست نقش ها دریافت شد",
  UPDATED = "نقش با موفقیت بروز رسانی شد",
  DELETED = "نقش با موفقیت حذف شد",
}

export enum RoleErrorMessages {
  DUPLICATE = "نقش تکراری است",
  NOT_FOUND = "نقش پیدا نشد",
  FORBIDDEN_UPDATE_SUPER_ADMIN_ROLE = "دسترسی غیر مجاز! نقش ادمین کل قابل ویرایش نیست",
  FORBIDDEN_DELETE_SUPER_ADMIN_ROLE = "دسترسی غیر مجاز! نقش ادمین کل قابل حذف نیست",
}
