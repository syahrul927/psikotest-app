type Params = Promise<{ slug: string; type?: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export type PageType = {
  params: Params;
  searchParams: SearchParams;
};
