import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useCallback, useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { mixed, object, string } from "yup";
import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { signupPerson, updatePePerson } from "@/services/user";
import { IPEPerson, IUser } from "@/types";
import Select from "react-select";
import { debounce } from "lodash";
import TextInput from "@/components/widgets/forms/TextInput";
import { getEntities } from "@/services/entities";
import { IconFileText } from "@tabler/icons-react";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import 'react-phone-number-input/style.css'
import { AxiosResponse } from "axios";

interface IProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  initials?: IPEPerson;
}

const schema = object().shape({
  firstName: string().required("First name is required"),
  lastName: string().required("Last name is required"),
  gender: string().oneOf(["MALE", "FEMALE"]).required("Gender is required"),
  email: string().email().required("Email is required"),
  address: string().required("Address is required"),
  jobTitle: string().required("Job title is required"),
  procurementEntityId: string().required("Entity is required"),
  phoneNumber: string().required("Phone Number is required"),
  passportPhoto: mixed(),
  // .test("is-image", "File must be an image", (value) => {
  //   if (!value) return false;
  //   return value instanceof File && value.type.startsWith("image/");
  // }),
});

const updateSchema = object().shape({
  firstName: string().required("First name is required"),
  lastName: string().required("Last name is required"),
  gender: string().required("Gender is required"),
});

export default function PEPersonFormModal({ open, onClose, refetch, initials }: IProps) {
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => signupPerson(data),
    onSuccess: () => {
      reset();
      onClose();
      refetch();
      reset();
      toast.success("User created successful");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create user");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { payload: FormData; userId: string }) =>
      updatePePerson(data.payload, data.userId),
    onSuccess: (res: any) => {
      onClose();
      refetch();
      reset();
      toast.success(res.data.message || "User updated successfully");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Failed to update user";
      toast.error(msg);
    },
  });

  const submit = (data: Record<string, any>) => {

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("gender", data.gender);
    formData.append("jobTitle", data.jobTitle);
    formData.append("procurementEntityId", data.procurementEntityId);

    if (image) formData.append("passportPhoto", image as File);

    if (initials) {
      updateMutation.mutate({
        payload: formData,
        userId: initials.id!,
      });
    } else {


      createMutation.mutate(formData);
    }
  };


  useEffect(() => {
    if (initials) {
      reset({
        firstName: initials.firstName,
        lastName: initials.lastName,
        gender: initials.gender,
        email: initials.email,
        address: initials.address,
        jobTitle: initials.jobTitle,
        phoneNumber: initials.phoneNumber,
        procurementEntityId: initials.procurementEntityId,
      });
      setEntities([{ value: initials.procurementEntityId, label: initials.entityName }]);
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

  // initial phone number
  const preloadedPhoneNumberCountry = initials?.phoneNumber ? parsePhoneNumber(initials.phoneNumber)?.country : undefined;


  return (
    <Modal
      size="md"
      title="PE Person Form"
      isOpen={open}
      onClose={() => {
        onClose();
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
            value={entities.find((e) => e.value === getValues("procurementEntityId"))}
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

          {/* Gender input*/}
          <div className="flex flex-col">
            <div className="flex flex-row gap-x-4">
              <div className="flex flex-col">
                <label htmlFor="male">Male</label>
                <input
                  type="radio"
                  id="male"
                  value="MALE"
                  {...register("gender")}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="female">Female</label>
                <input
                  type="radio"
                  id="female"
                  value="FEMALE"
                  {...register("gender")}
                />
              </div>
            </div>
            {/* error */}
            <p className="text-xs text-red-500 mt-1 mx-0.5">
              {errors.gender?.message?.toString()}
            </p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="">Phone number</label>
            <PhoneInput
              value={getValues("phoneNumber")}
              country={preloadedPhoneNumberCountry || "TZ"}
              international={true}
              className="custom-phone-input"
              placeholder="e.g., 710101010"
              name="phoneNumber"
              onChange={(value: any) => setValue("phoneNumber", value)}

            />
            {/* error */}
            <p className="text-xs text-red-500 mt-1 mx-0.5">
              {errors.phoneNumber?.message?.toString()}
            </p>
          </div>
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
            label="Address"
            placeholder="e.g., P.O Box 12345, Dar es Salaam"
            hasError={!!errors.address}
            error={errors.address?.message}
            register={register("address")}
            disabled={!!initials}
          />
          <TextInput
            type="text"
            label="Job title"
            placeholder="e.g., Procurement Officer"
            hasError={!!errors.jobTitle}
            error={errors.jobTitle?.message}
            register={register("jobTitle")}
            disabled={!!initials}
          />
          <div className="col-span-full">
            <label className="block mb-2">Image</label>
            <label
              htmlFor="documentFile"
              className="label block py-10 bg-slate-50 border border-dashed border-slate-200 rounded-md cursor-pointer"
            >
              <div className="text-slate-500 text-xs text-center font-light">
                {image !== null ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <img src={URL.createObjectURL(image)} className="w-20 mr-2 rounded-lg" alt="" />
                    {image.name}
                  </div>
                ) : (
                  <>
                    <IconFileText
                      size={32}
                      strokeWidth={1.5}
                      className="mx-auto mb-4"
                    />
                    <Fragment>
                      <p>Add your image (.jpg, .jpeg, .png) file here</p>
                    </Fragment>
                  </>
                )}
                <p className="text-green-500 font-medium">Click to browse</p>
              </div>
              <input
                type="file"
                id="documentFile"
                accept="image/jpg, image/jpeg, image/png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImage(file);
                  if (file) {
                    setValue("passportPhoto", file, { shouldValidate: true });
                  }
                }}
              />
            </label>

            <p className="text-xs text-red-500 mt-1 mx-0.5">
              {errors.passportPhoto?.message?.toString()}
            </p>
          </div>

        </div>

        <Button
          type="submit"
          label="Save"
          theme="primary"
          size="md"
          disabled={createMutation.isPending || updateMutation.isPending}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </form>
    </Modal>
  );
}
