import { yupResolver } from "@hookform/resolvers/yup";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useSnapshot } from "valtio";
import { object, string } from "yup";
import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { signup, updateUser } from "@/services/auth";
import { authStore } from "@/store/auth";
import { IRole, IUser } from "@/types";
import { IRegisterForm } from "@/types/forms";
import useRoles from "@/hooks/useRoles";
import TextInput from "@/components/widgets/forms/TextInput";
import { useUserDataContext } from "@/providers/userDataProvider";
interface IProps {
  onSuccess: () => void;
  initials?: IUser;
}

const schema = object().shape({
  firstName: string().required("First name is required"),
  lastName: string().required("Last name is required"),
  email: string().email().required("Email is required"),
  phoneNumber: string().required("Phone number is required"),
  role: string().required("Role is required"),
  status: string().optional(),
  nationalId: string().required("National ID number is required"),
});

const updateSchema = object().shape({
  name: string().required("Name is required"),
});

export default function UserForm({ onSuccess, initials }: IProps) {
  const auth = useSnapshot(authStore);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);

  const { userData } = useUserDataContext();  // Use the hook to get user data
  const userRole = userData?.role || "BIDDER";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const {
    register: updateRegister,
    handleSubmit: updateHandleSubmit,
    setValue: updateSetValue,
    reset: updateReset,
    formState: { errors: errorsUpdate },
  } = useForm({
    resolver: yupResolver(updateSchema),
  });

  const { roles, isLoading } = useRoles({ page: 0, search: "", filter: {} });

  const createMutation = useMutation({
    mutationFn: (data: IRegisterForm) => signup(data),
    onSuccess: (res) => {
      reset();
      setCreate(false);
      toast.success("User created successful");
    },
    onError: (error: any) => {
      toast.error("Failed to create user");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { payload: IRegisterForm; userId: string }) =>
      updateUser(data.payload, data.userId),
    onSuccess: () => {
      updateReset();
      setUpdate(false);
      toast.success("User updated successfully");
      onSuccess();
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  const submit = (data: Record<string, any>) => {

    createMutation.mutate(data as IRegisterForm);
  };

  const updateSubmit = (data: Record<string, any>) => {
    if (initials) {
      updateMutation.mutate({
        payload: data as IRegisterForm,
        userId: initials.id,
      });
    }
  };

  useEffect(() => {
    if (initials) {
      updateSetValue("name", initials.name);
      // updateSetValue("name", initials.roleId);
      setUpdate(true);
    }
  }, [initials]);

  return (
    <div className="max-w-max">
      <Button
        type="button"
        label="Add User"
        icon={<IconPlus size={18} />}
        theme="primary"
        size="md"
        onClick={() => setCreate(true)}
      />

      <Modal
        size="md"
        title="Create User"
        isOpen={create}
        onClose={() => {
          setCreate(false);
          reset();
        }}
      >
        <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <TextInput
              type="text"
              label="First name"
              placeholder="e.g., Mtaalam"
              hasError={!!errors.firstName}
              error={errors.firstName?.message}
              register={register("firstName")}
            />
            <TextInput
              type="text"
              label="Last name"
              placeholder="e.g., Msanga"
              hasError={!!errors.lastName}
              error={errors.lastName?.message}
              register={register("lastName")}
            />
            <TextInput
              type="text"
              label="Phone number"
              placeholder="e.g., 0710101010"
              hasError={!!errors.phoneNumber}
              error={errors.phoneNumber?.message}
              register={register("phoneNumber")}
              disabled={!!initials}
            />
            <TextInput
              type="email"
              label="Email"
              placeholder="e.g., info@wintender.tz"
              hasError={!!errors.email}
              error={errors.email?.message}
              register={register("email")}
              disabled={!!initials}
            />

            <TextInput
              type="text"
              label="ID Number"
              hasError={errors.nationalId?.type != undefined}
              error={errors.nationalId?.message}
              register={register("nationalId")}
            />

            <div>
              <label htmlFor="role" className="block mb-2">
                Role
              </label>

              <select
                className={errors.role ? "input-error" : "input-normal"}
                {...register("role", { required: true })}
                disabled={!!initials}
              >
                <option value=""></option>
                {roles?.content
                  .filter((item: IRole) => {

                    // For any role which is not ADMINISTRATOR, don't show any options
                    if (!["ADMINISTRATOR", "MANAGER"].includes(userRole)) {
                      return false;
                    }

                    // For ADMINISTRATOR, show everything (no filter needed)
                    return true;
                  })
                  .map((item: IRole) => (
                    <option
                      selected={item.id === initials?.roleId}
                      value={item.id}
                      key={item.id}
                    >
                      {item.role}
                    </option>
                  ))}

              </select>
            </div>

          </div>

          <Button
            type="submit"
            label="Save"
            theme="primary"
            size="md"
            loading={createMutation.isPending}
          />
        </form>
      </Modal>

      <Modal
        size="md"
        title="Update User"
        isOpen={update}
        onClose={() => {
          setUpdate(false);
          reset();
        }}
      >
        <form
          className="flex flex-col"
          onSubmit={updateHandleSubmit(updateSubmit)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <TextInput
              type="text"
              label="Name"
              placeholder="e.g., John"
              hasError={!!errorsUpdate.name}
              error={errorsUpdate.name?.message}
              register={updateRegister("name")}
            />
          </div>

          <div>
            <label htmlFor="role" className="block mb-2">
              Role
            </label>

            <select
              className={errors.role ? "input-error" : "input-normal"}
              {...register("role", { required: true })}
            >
              <option value=""></option>
              {roles?.content
                .filter((item: IRole) => {

                  // For any role which is not ADMINISTRATOR, don't show any options
                  if (["ADMINISTRATOR", "MANAGER"].includes(userRole)) {
                    return !["ADMINISTRATOR", "PROCUREMENT_ENTITY","BIDDER"].includes(item.role);
                  }

                  // For ADMINISTRATOR, show everything (no filter needed)
                  
                  return false;
                })
                .map((item: IRole) => (
                  <option
                    selected={item.id === initials?.roleId}
                    value={item.id}
                    key={item.id}
                  >
                    {item.role}
                  </option>
                ))}

            </select>
          </div>

          <div>
            <label htmlFor="role" className="block my-2">
              Status
            </label>

            <select
              className={errors.role ? "input-error" : "input-normal"}
              {...register("status", { required: true })}
              defaultValue={initials?.status}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <div className="mt-4"></div>
          <Button
            type="submit"
            label="Update"
            theme="primary"
            size="md"
            loading={updateMutation.isPending}
          />
        </form>
      </Modal>
    </div>
  );
}
