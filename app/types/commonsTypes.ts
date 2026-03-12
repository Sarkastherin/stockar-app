export type CommonPropsDB = {
  id: string; // id UUID
  created_at: string;
  updated_at: string;
  created_by?: string; // user id UUID
  updated_by?: string; // user id UUID
  creator?: string; // user name
  updater?: string; // user name
  active: boolean;
};
const commonProps = {
  id: "",
  created_at: "",
  updated_at: "",
  created_by: "",
  updated_by: "",
  creator: "",
  updater: "",
  active: true,
};
export { commonProps };
