import { yupResolver } from "@hookform/resolvers/yup";
import { IconFileText, IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { mixed, object, string } from "yup";
import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { createEntity, updateEntity } from "@/services/entities";
import TextInput from "@/components/widgets/forms/TextInput";
import { IEntity } from "@/types";

interface IProps {
  initials?: { type: "create" | "update" | "delete" | null, user: IEntity | null };
  setIsModalOpen?: ( v:{ type: "create" | "update" | "delete" | null, user: IEntity | null }) => void;
  onSuccess: () => void;
}

const schema = object().shape({
  logoFile: mixed().required("Logo File is required"),
  name: string().required("Name is required"),
  primaryNumber: string().required("Primary Number is required"),
  address: string().required("Address is required"),
  entityType: string().required("Type is required"),
  email: string().required("Email is required"),
  summary: string().required("Summary is required"),
  status: string().oneOf(["ACTIVE", "INACTIVE"]).required("Status is required")
});

export default function ({ ...props }: IProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [logoFile, setLogoFile] = useState<string | any>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: { entityType: "", name: "", primaryNumber: "", },
  });

  watch((data, { name, type }) => {
    if (name === "logoFile" && type === "change") {
      setLogoFile(data.tenderFile[0]?.name);
    }
  });


  const createMutation = useMutation({
    mutationFn: (data: FormData) => createEntity(data),
    onSuccess: () => {
      reset();
      setLogoFile(undefined);
      setOpen(false);
      toast.success("Entity created successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to create entity " + error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: IEntity }) =>
      updateEntity(data.id, data.payload),
    onSuccess: (res) => {
      reset();
      setOpen(false);
      toast.success("Entity updated successful");
      props.onSuccess();
    },
    onError: (error: any) => {
      toast.error("Failed to update Entity details");
    },
  });


  const submit = (data: Record<string, any>) => {
    console.log(data);
    const formData = new FormData();
    formData.append("file", data.logoFile[0]);
    formData.append("name", data.name);
    formData.append("primaryNumber", data.primaryNumber);
    formData.append("address", data.address);
    formData.append("entityType", data.entityType);
    formData.append("email", data.email);
    formData.append("summary", data.summary);
    formData.append("status", data.status);
    createMutation.mutate(formData);
  };

  useEffect(() => {
    if (props.initials?.type === "update" && props.initials?.user) {
      setValue("name", props.initials.user.name);
      setValue("primaryNumber", `0${props.initials.user.primaryNumber.slice(1)}`),
      setValue("address", props.initials.user.address);
      setValue("email", props.initials.user.email);
      setValue("summary", props.initials.user.summary);
      setValue("entityType", props.initials.user.entityType);
      setValue("status", props.initials.user.status);

      setOpen(true);
    }
    else if(props.initials?.type === "create"){
      reset();
      setOpen(true);
    }
  }, [props.initials?.type]);

  const handleModalClose = () => {
    props.setIsModalOpen?.({ type: null, user: null });
    setOpen(false);
  }

  return (
    <div className="max-w-max">
      <Button
        type="button"
        label="Entity"
        icon={<IconPlus size={18} />}
        theme="primary"
        size="md"
        onClick={() => props.setIsModalOpen?.({type: "create", user: null})}
      />

      <Modal
        size="lg"
        title="Procurement Entity"
        isOpen={open}
        onClose={handleModalClose}
      >
        <form className="" onSubmit={handleSubmit(submit)}>
          <div className="mb-2">
            <label htmlFor="entityType" className="block mb-2">
              Type
            </label>

            <select
              className={`${errors.entityType?.type === "required"
                ? "input-error"
                : "input-normal"
                }`}
              {...register("entityType", { required: true })}
            >
              <option value="PRIVATE">PRIVATE</option>
              <option value="GOVERNMENT">GOVERNMENT</option>
            </select>
            <p className="text-xs text-red-500 mt-1 mx-0.5">
              {errors.entityType?.message?.toString()}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <TextInput
              type="text"
              label="Name"
              hasError={errors.name?.type != undefined}
              register={register("name")}
            />

            <TextInput
              type="text"
              label="Primary Phone"
              placeholder="eg 0710101010"
              hasError={errors.primaryNumber?.type != undefined}
              register={register("primaryNumber")}
            />

            <TextInput
              type="text"
              label="Address"
              hasError={errors.address?.type != undefined}
              register={register("address")}
            />
            <TextInput
              type="text"
              label="Email"
              hasError={errors.email?.type != undefined}
              register={register("email")}
            />
          </div>

          {/* status radio for ACTIVE / INACTIVE */}
          <div className="mb-4">
            <label className="block mb-2">Status <span className="text-[8pt] text-red-500"> (This will permanently affect the entity visibility in the system)</span></label>
            <div className="flex items-center space-x-4">
              <label htmlFor="active" className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="active"
                  value="ACTIVE"
                  {...register("status")}
                />
                <div>ACTIVE</div>
              </label>
              <label htmlFor="inactive" className="flex items-center space-x-2">  {/* Add space-x-2 */}
                <input
                  type="radio"
                  id="inactive"
                  value="INACTIVE"
                  {...register("status")}
                />
                <div>INACTIVE</div>
              </label>
              <label htmlFor="deleted" className="flex items-center space-x-2">  {/* Add space-x-2 */}
                <input
                  type="radio"
                  id="deleted"
                  value="DELETED"
                  {...register("status")}
                />
                <div>DELETED</div>
              </label>
            </div>
          </div>

          <div className="mb-2">
            <label htmlFor="summary" className="block mb-2">
              Summary
            </label>

            <textarea
              rows={3}
              className={`${errors.summary?.type === "required"
                ? "input-error"
                : "input-normal"
                }`}
              {...register("summary", { required: true })}
            ></textarea>
            <p className="text-xs text-red-500 mt-1 mx-0.5">
              {errors.summary?.message?.toString()}
            </p>
          </div>

          {/* radio but */}

          <div className="mb-6">
            <label className="block mb-2">LOGO</label>
            <label
              htmlFor="logoFile"
              className="label block py-10 bg-slate-50 border border-dashed border-slate-200 rounded-md cursor-pointer"
            >
              <div className="text-slate-500 text-xs text-center font-light">
                <IconFileText
                  size={32}
                  strokeWidth={1.5}
                  className="mx-auto mb-4"
                />
                {logoFile ? (
                  <div>{logoFile}</div>
                ) : (
                  <Fragment>
                    <p>Add Entity LOGO .jpg file here</p>
                    <p className="text-blue-500 font-medium">Click to browse</p>
                  </Fragment>
                )}
              </div>
              <input
                type="file"
                id="logoFile"
                accept=".jpg"
                className="hidden"
                {...register("logoFile")}
              />
            </label>

            <p className="text-xs text-green-600 mt-1 mx-0.5">
              {errors.logoFile?.message?.toString()}
            </p>
          </div>

          <Button
            type="submit"
            label="Register"
            theme="primary"
            size="md"
            loading={createMutation.isPending || updateMutation.isPending}
          />
        </form>
      </Modal>
    </div>
  );
}

