export const PAGE_URLS = {
  HOME: "/",
  LOGIN: "/authentication",
  NOT_FOUND: "/404",
  // IST
  IST_INVITATION: "/ist-invitation",
  USER_ACCESS: "/user",
  USER_ACCESS_CREATE: "/user/create",
  USER_ACCESS_EDIT: (id: string) => `/user/${id}/edit`,

  // Kraepelin
  KRAEPELIN_INVITATION: "/kraepelin-invitation",
  KRAEPELIN_INVITATION_RESULT: (id: string) => `/kraepelin-invitation/${id}`,
  KRAEPELIN_INVITATION_CREATE: "/kraepelin-invitation/create",

  // settings
  SETTINGS: "/settings",

  // public Kraepelin
  KRAEPELIN_TRAINING: "/guest/kraepelin/training",
  KRAEPELIN_THANKS: "/guest/kraepelin/thanks",
  KRAEPELIN_TEST: (id: string) => `/guest/kraepelin/${id}/`,
  KRAEPELIN_TEST_CONFIRMATION: (id: string) =>
    `/guest/kraepelin/${id}/confirmation`,
  KRAEPELIN_TEST_PROFILE: (id: string) => `/guest/kraepelin/${id}/profile`,
} as const;
