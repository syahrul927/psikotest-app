export const PAGE_URLS = {
  HOME: "/",
  LOGIN: "/authentication",
  NOT_FOUND: "/404",
  // settings
  SETTINGS: "/settings",
  USER_ACCESS: "/user",
  USER_ACCESS_CREATE: "/user/create",
  USER_ACCESS_EDIT: (id: string) => `/user/${id}/edit`,

  // IST
  IST_INVITATION: "/ist-invitation",
  IST_INVITATION_REVIEW: (id: string) => `/ist-invitation/${id}/review`,
  IST_INVITATION_RESULT: (id: string) => `/ist-invitation/${id}/result`,
  IST_SETTINGS: "/ist-settings",

  //public IST
  IST_TEST_PROFILE: (id: string) => `/guest/ist/${id}/profile`,
  IST_SUBTEST: (id: string) => `/guest/ist/${id}/subtest`,
  IST_SUBTEST_TEST: (id: string, type: string) =>
    `/guest/ist/${id}/subtest/test/${type}`,
  IST_SUBTEST_TEST_TRAINING: (id: string, type: string) =>
    `/guest/ist/${id}/subtest/test/${type}/training`,
  IST_TEST_CONFIRMATION: (id: string) => `/guest/ist/${id}/confirmation`,
  IST_THANKS: "/guest/ist/thanks",

  // Kraepelin
  KRAEPELIN_INVITATION: "/kraepelin-invitation",
  KRAEPELIN_INVITATION_RESULT: (id: string) => `/kraepelin-invitation/${id}`,

  // public Kraepelin
  KRAEPELIN_TRAINING: "/guest/kraepelin/training",
  KRAEPELIN_THANKS: "/guest/kraepelin/thanks",
  KRAEPELIN_TEST: (id: string) => `/guest/kraepelin/${id}/`,
  KRAEPELIN_TEST_CONFIRMATION: (id: string) =>
    `/guest/kraepelin/${id}/confirmation`,
  KRAEPELIN_TEST_PROFILE: (id: string) => `/guest/kraepelin/${id}/profile`,
} as const;
