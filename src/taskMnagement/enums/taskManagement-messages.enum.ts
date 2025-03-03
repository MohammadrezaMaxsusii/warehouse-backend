export enum taskManagementSuccessMessages {
  CREATED = "وظایف ایجاد شد",
  FOUND = "انبار پیدا شد",
  LISTED = "لیست وظایف ها دریافت شد",
  UPDATED = "انبار با موفقیت بروز رسانی شد",
  DELETED = "انبار با موفقیت حذف شد",
  DONE = "انجام شد",
}

export enum taskManagementErrorMessages {
  DUPLICATE = " تکراری است",
  NOT_FOUND = "وظیفه  پیدا نشد",
}

export enum taskManagementFlowList {
  PROJECT_CREATE = "ساخت پروژه",
  PRUDUCT_CREATE = "ساخت محصول",
  BUY_PRODUCT = "خرید محصول",
  VERIFY_PRODUCT = "تایید محصول",
  STORE_PRODUCT = "ذخیره در انبار",
  ASSIGN_PRUDUCT = "انتقال محصول به پروژه",
  ASSIGN_PRODUCT = "نصب محصولات",
  REJECT_PRODUCT = "رد محصولات",
  BUYED = "خریداری شده",
  VERIFY = "تایید",
  REJECT = "رد شده",
}
