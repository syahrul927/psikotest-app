export const PAGE_URLS = {
  HOME: "/",
  LOGIN: "/authentication",
  NOT_FOUND: "/404",
  KRAEPLIN_INVITATION: "/kraeplin-invitation",
  KRAEPLIN_INVITATION_RESULT: (id: string) => `/kraeplin-invitation/${id}`,
  KRAEPLIN_INVITATION_CREATE: "/kraeplin-invitation/create",
  IST_INVITATION: "/ist-invitation",
  USER_ACCESS: "/user",
  USER_ACCESS_CREATE: "/user/create",
  USER_ACCESS_EDIT: (id: string) => `/user/${id}/edit`,
  // settings
  SETTINGS: "/settings",

  // public
  KRAEPLIN_TRAINING: "/p/kraeplin/training",
  KRAEPLIN_THANKS: "/p/kraeplin/thanks",
  KRAEPLIN_TEST: (id: string) => `/p/kraeplin/${id}/`,
  KRAEPLIN_TEST_CONFIRMATION: (id: string) => `/p/kraeplin/${id}/confirmation`,
  KRAEPLIN_TEST_PROFILE: (id: string) => `/p/kraeplin/${id}/profile`,
} as const;
