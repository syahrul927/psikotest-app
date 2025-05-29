export type PageType = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
