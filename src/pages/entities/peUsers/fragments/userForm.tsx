import { yupResolver } from "@hookform/resolvers/yup";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { object, string } from "yup";
import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { signup, updateUser } from "@/services/auth";
import { IUser } from "@/types";
import { IRegisterForm } from "@/types/forms";
import Select from "react-select";
import { debounce } from "lodash";
import TextInput from "@/components/widgets/forms/TextInput";
import { getEntities } from "@/services/entities";
interface IProps {
  onSuccess: () => void;
  initials?: IUser;
}

const schema = object().shape({
  firstName: string().required("First name is required"),
  lastName: string().required("Last name is required"),
  email: string().email().required("Email is required"),
  procurementEntityId: string().required("Entity is required"),
  phoneNumber: string().required("Phone Number is required"),
});

const updateSchema = object().shape({
  name: string().required("Name is required"),
});

export default function UserForm({ onSuccess, initials }: IProps) {
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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

  const createMutation = useMutation({
    mutationFn: (data: IRegisterForm) => signup(data),
    onSuccess: (res) => {
      reset();
      setCreate(false);
      toast.success("User created successful");
    },
    onError: (error: any) => {
      toast.error("Failed to create user" + error);
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
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Failed to create user";
      toast.error(msg);
    },
  });

  const submit = (data: Record<string, any>) => {

    const finalData = {
      ...data,
      role: "685e78534c328a58a6291cf7",
      nationalId: "00000000000000000000",
    };

    createMutation.mutate(finalData as IRegisterForm);
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
      setUpdate(true);
    }
  }, [initials]);


  const fetchEntities = useCallback(async (search = "") => {
    if (!search) {
      setEntities([]);
      return;
    }

    setLoading(true);
    try {
      const allEntities = await getEntities({ page: 0, size: 5, search });
      setEntities(allEntities.content.map(e => ({ value: e.id, label: e.name.toUpperCase() })));
    } catch (error) {
      console.error("Failed to fetch entities", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetchEntities = useCallback(
    debounce((inputValue) => {
      if (inputValue.length >= 3) { // Only fetch if 5 or more characters
        fetchEntities(inputValue);
      } else {
        setEntities([]); // Clear entities if less than 5 characters
      }
    }, 5),
    [fetchEntities]
  );

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
        title="Create PE User"
        isOpen={create}
        onClose={() => {
          setCreate(false);
          reset();
        }}
      >
        <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
          <div className="mb-2">
            <label htmlFor="com" className="block mb-2">
              Entity
            </label>
            <Select
              options={entities}
              onInputChange={(inputValue) => debouncedFetchEntities(inputValue)} // Debounced fetch
              onChange={(selectedOption) => setValue("procurementEntityId", selectedOption?.value)}
              isLoading={loading}
              placeholder="Search for a entity"
            />
            <p className="text-xs text-red-500 mt-1 mx-0.5">
              {errors.procurementEntityId?.message?.toString()}
            </p>
          </div>

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


          </div>

          <Button
            type="submit"
            label="Save"
            theme="primary"
            size="md"
            loading={createMutation.isLoading}
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

          <Button
            type="submit"
            label="Update"
            theme="primary"
            size="md"
            loading={updateMutation.isLoading}
          />
        </form>
      </Modal>
    </div>
  );
}
