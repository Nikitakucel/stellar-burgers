import { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/userSlice';
import { ProfileUI } from '@ui-pages';

export const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue((prev) => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isFormChanged) return;

    const updatedData: { name?: string; email?: string; password?: string } =
      {};
    if (user?.name !== formValue.name) updatedData.name = formValue.name;
    if (user?.email !== formValue.email) updatedData.email = formValue.email;
    if (formValue.password !== '') updatedData.password = formValue.password;

    dispatch(updateUser(updatedData))
      .unwrap()
      .then(() => setFormValue((prev) => ({ ...prev, password: '' })))
      .catch((err) => console.error(err));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleInputChange={handleInputChange}
    />
  );
};
