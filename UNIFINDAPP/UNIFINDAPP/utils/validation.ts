
type ReportForm = {
  name: string;
  email: string;
  msg: string;
};

export const validateReportForm = (form: ReportForm) => {
  const errors: {
    name?: string;
    email?: string;
    msg?: string;
  } = {};

  const emailRegex = /\S+@\S+\.\S+/;

  if (!form.name) {
    errors.name = 'Name is required';
  }

  if (!form.email) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Invalid email format';
  }

  if (!form.msg) {
    errors.msg = 'Description is required';
  }

  return errors;
};
