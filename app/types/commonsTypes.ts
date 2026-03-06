export type CommonPropsDB = {
  id: string; // id UUID
  created_at: string;
  updated_at: string;
  created_by: string; // user id UUID
  updated_by: string; // user id UUID
  active?: boolean;
};
const commonProps = {
  id: "",
  created_at: "",
  updated_at: "",
  created_by: "",
  updated_by: "",
  active: true,
};
export { commonProps };
