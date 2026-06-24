import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useCallback, useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { mixed, number, object, string } from "yup";
import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { signupPerson, updatePePerson } from "@/services/user";
import Select from "react-select";
import { debounce } from "lodash";
import TextInput from "@/components/widgets/forms/TextInput";
import { getEntities } from "@/services/entities";
import { IconFileText } from "@tabler/icons-react";
import 'react-phone-number-input/style.css'
import { DIFMStatusOptions } from "@/types/statuses";

interface IProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  initials?: any;
}

const schema = object().shape({
  startDate: string().required("Start date is required"),
  endDate: string().required("End date is required"),
  // gender: string().oneOf(["MALE", "FEMALE"]).required("Gender is required"),
  description: string().required("Description is required"),
  projectTitle: string().required("Job title is required"),
  procurementEntityId: string().required("Entity is required"),
  contractValue: number().required("Contract value is required"),
  projectFile: mixed(),
});

const updateSchema = object().shape({
  firstName: string().required("First name is required"),
  lastName: string().required("Last name is required"),
  gender: string().required("Gender is required"),
  description: string().required("Description is required"),
});

export default function PartnershipFormModal({ open, onClose, refetch, initials }: IProps) {
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
    formData.append("description", data.description);
    formData.append("address", data.address);
    formData.append("contractValue", data.contractValue);
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
        startDate: initials.startDate,
        endDate: initials.endDate,
        // gender: initials.gender,
        description: initials.description,
        // address: initials.address,
        projectTitle: initials.projectTitle,
        contractValue: initials.contractValue,
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



  return (
    <Modal
      size="md"
      title="Partnership/JV Form"
      isOpen={open}
      onClose={() => {
        onClose();
        reset();
      }}
    >
      <form className="flex flex-col" onSubmit={handleSubmit(submit)}>

        <TextInput
          type="text"
          label="Title"
          placeholder="e.g., Project name"
          hasError={!!errors.projectTitle}
          error={errors.projectTitle?.message}
          register={register("projectTitle")}
          disabled={!!initials}
        />


        <div className="mb-2">
          <label htmlFor="com" className="block mb-2">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter description"
            {...register("description")}
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500"
          ></textarea>
        </div>
        <TextInput
          type="number"
          label="Contract Value"
          placeholder="e.g., 1000000"
          hasError={!!errors.contractValue}
          error={errors.contractValue?.message}
          register={register("contractValue")}
          // disabled={!!initials}
        />

        <div className="mb-2">
          <label htmlFor="com" className="block mb-2">
            Partners
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

        <div className="mb-2">
          <label htmlFor="com" className="block mb-2">
            Status
          </label>
          <Select
            placeholder="Select status"
            options={DIFMStatusOptions}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <TextInput
            type="datetime-local"
            label="Start Date"
            // placeholder="e.g., Mtaalam"
            hasError={!!errors.startDate}
            error={errors.startDate?.message}
            register={register("startDate")}
          />
          <TextInput
            type="datetime-local"
            label="End Date"
            // placeholder="e.g., Msanga"
            hasError={!!errors.endDate}
            error={errors.endDate?.message}
            register={register("endDate")}
          />

          {/* Gender input*/}
          {/* <div className="flex flex-col">
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
            <p className="text-xs text-red-500 mt-1 mx-0.5">
              {errors.gender?.message?.toString()}
            </p>
          </div> */}

          <div className="col-span-full">
            <label className="block mb-2">Project file (pdf)</label>
            <label
              htmlFor="documentFile"
              className="label block py-10 bg-slate-50 border border-dashed border-slate-200 rounded-md cursor-pointer"
            >
              <div className="text-slate-500 text-xs text-center font-light">

                <>
                  <IconFileText
                    size={32}
                    strokeWidth={1.5}
                    className="mx-auto mb-4"
                  />
                  <Fragment>
                    <p>Add your project file (pdf) here</p>
                  </Fragment>
                </>
                <p className="text-green-500 font-medium">Click to browse</p>
              </div>
              <input
                type="file"
                id="documentFile"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImage(file);
                  if (file) {
                    setValue("projectFile", file, { shouldValidate: true });
                  }
                }}
              />
            </label>

            <p className="text-xs text-red-500 mt-1 mx-0.5">
              {errors.projectFile?.message?.toString()}
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
