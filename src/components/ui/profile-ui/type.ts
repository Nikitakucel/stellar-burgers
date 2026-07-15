// src/components/ui/profile-ui/type.ts
import { SyntheticEvent } from 'react';

export type ProfileUIProps = {
  formValue: {
    name: string;
    email: string;
    password: string;
  };
  isFormChanged: boolean;
  handleSubmit: (e: SyntheticEvent) => void;
  handleCancel: (e: SyntheticEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogout: () => void;
};
