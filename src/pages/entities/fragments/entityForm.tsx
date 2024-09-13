import { yupResolver } from "@hookform/resolvers/yup";
import { IconFileText, IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { array, date, mixed, number, object, string } from "yup";
import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { LATITUDE_REGEX, LONGITUDE_REGEX, PHONE_REGEX } from "@/constants";
import { createEntity, updateEntity } from "@/services/entities";
import { IVendor } from "@/types";
import { IVendorForm } from "@/types/forms";
import TextInput from "@/components/widgets/forms/TextInput";
import { authStore } from "@/store/auth";
import { useSnapshot } from "valtio";

interface IProps {
  initials?: IVendor;
  onSuccess: () => void;
}

const schema = object().shape({
  licenceFile: mixed(),
  tinFile: mixed(),
  otherFile: mixed(),
  name: string().required("Name is required"),
  primaryNumber: string().required("Primary Number is required"),
  secondaryNumber: string().required("Secondary Number is required"),
  email: string().email().required("Email is required"),
  address: string().required("Address is required"),
  latitude: string()
    .matches(LATITUDE_REGEX, "Invalid latitude")
    .required("Latitude is required"),
  longitude: string()
    .matches(LONGITUDE_REGEX, "Invalid longitude")
    .required("Longitude is required"),
  taxIdentificationNumber: number().required("TIN is required"),
  licenceNumber: string(),
  licenceExpireDate: date(),
  type: string(),
  currency: string(),
  code: string(),
  sellingPricePercantage: string(),
  paymentPercantage: string(),
  assignedModels: array().of(string()),
});

export default function ({ ...props }: IProps) {
  const auth = useSnapshot(authStore);
  const [licenceFileName, setLicenceFileName] = useState<string | any>();
  const [tinFileName, setTinFileName] = useState<string | any>();
  const [otherFileName, setOtherFileName] = useState<string | any>();
  const [typeSelect, setTypeSelect] = useState<string | any>();
  const [open, setOpen] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });


  watch((data, { name, type }) => {
    if (name === "licenceFile" && type === "change") {
      setLicenceFileName(data.licenceFile[0]?.name);
    }

    if (name === "tinFile" && type === "change") {
      setTinFileName(data.tinFile[0]?.name);
    }

    if (name === "otherFile" && type === "change") {
      setOtherFileName(data.otherFile[0]?.name);
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => createEntity(data),
    onSuccess: (res) => {
      reset();
      setOpen(false);
      toast.success("Entity created successful");
      props.onSuccess();
    },
    onError: (error: any) => {
      // toast.error("Failed to create vendor");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: FormData }) =>
      updateEntity(data.id, data.payload),
    onSuccess: (res) => {
      reset();
      setOpen(false);
      toast.success("Vendor updated successful");
      props.onSuccess();
    },
    onError: (error: any) => {
      // toast.error("Failed to update vendor details");
    },
  });

  const submit = (payload: Record<string, any>) => {
    const assignedModels = Array.isArray(payload.assignedModels)
      ? payload.assignedModels
      : [];

    let data = payload as IVendorForm;
    let formData = new FormData();

    if (data.licenceFile?.[0] && data.tinFile?.[0]) {
      formData.append("licenceFile", data.licenceFile[0]);
      formData.append("tinFile", data.tinFile[0]);
      formData.append("otherFile", data.otherFile[0]);
    }

    formData.append("name", data.name);
    formData.append("primaryNumber", data.primaryNumber);
    formData.append("secondaryNumber", data.secondaryNumber);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("latitude", data.latitude);
    formData.append("longitude", data.longitude);
    formData.append("type", data.type);
    formData.append("code", data.code || "");
    formData.append("currency", data.currency || "");
    formData.append(
      "sellingPricePercantage",
      data.sellingPricePercantage || ""
    );
    formData.append("paymentPercantage", data.paymentPercantage || "");
    formData.append(
      "taxIdentificationNumber",
      data.taxIdentificationNumber.toString()
    );
    formData.append("licenceNumber", data.licenceNumber.toString());
    formData.append("licenceExpiryDate", data.licenceExpireDate.toISOString());

    // Debugging step: Log assignedModels to check its structure
    console.log("Assigned Models:", assignedModels);

    assignedModels.forEach((id: string) => {
      formData.append("assignedModels[]", id);
    });

    if (props.initials) {
      updateMutation.mutate({
        id: props.initials.id,
        payload: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const currentModels = (watch("assignedModels") || []) as string[];

    if (checked) {
      setValue("assignedModels", [...currentModels, value]);
    } else {
      setValue(
        "assignedModels",
        currentModels.filter((modelId) => modelId !== value)
      );
    }
  };

  useEffect(() => {
    if (props.initials) {
      setValue("name", props.initials.name);
      setValue("primaryNumber", `0${props.initials.primaryNumber.slice(1)}`),
        setValue(
          "secondaryNumber",
          `0${props.initials.secondaryNumber.slice(1)}`
        ),
        setValue("email", props.initials.email);
      setValue("latitude", props.initials.location.y);
      setValue("longitude", props.initials.location.x);
      setValue("type", props.initials.type);
      setValue("address", props.initials.address);
      setValue(
        "taxIdentificationNumber",
        parseInt(props.initials.taxIdentificationNumber)
      );
      setValue("licenceNumber", props.initials.licenceNumber);
      setValue("licenceExpireDate", new Date(props.initials.licenceExpireDate));
      setOpen(true);
    }
  }, [props.initials]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-max">
      <Button
        type="button"
        label="Entity"
        icon={<IconPlus size={18} />}
        theme="primary"
        size="md"
        onClick={() => setOpen(true)}
      />

      <Modal
        size="lg"
        title="Vendor Form"
        isOpen={open}
        onClose={(v) => setOpen(v)}
      >
        <form className="" onSubmit={handleSubmit(submit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <TextInput
              type="text"
              label="Name"
              hasError={errors.name?.type != undefined}
              error={errors.name?.message}
              register={register("name")}
            />

            <TextInput
              type="email"
              label="Email"
              placeholder="eg John"
              hasError={errors.email?.type != undefined}
              error={errors.email?.message}
              register={register("email")}
            />

            <TextInput
              type="text"
              label="Primary Phone"
              placeholder="eg 0710101010"
              hasError={errors.primaryNumber?.type != undefined}
              error={errors.primaryNumber?.message}
              register={register("primaryNumber")}
            />

            <TextInput
              type="text"
              label="Secondary Number"
              placeholder="eg 0710101010"
              hasError={errors.secondaryNumber?.type != undefined}
              error={errors.secondaryNumber?.message}
              register={register("secondaryNumber")}
            />

            <TextInput
              type="text"
              label="Address"
              hasError={errors.address?.type != undefined}
              error={errors.address?.message}
              register={register("address")}
            />

            <TextInput
              type="text"
              label="Latitude"
              hasError={errors.latitude?.type != undefined}
              error={errors.latitude?.message}
              register={register("latitude")}
            />

            <TextInput
              type="text"
              label="Longitude"
              hasError={errors.longitude?.type != undefined}
              error={errors.longitude?.message}
              register={register("longitude")}
            />

            <TextInput
              type="text"
              label="TIN Number"
              hasError={errors.taxIdentificationNumber?.type != undefined}
              error={errors.taxIdentificationNumber?.message}
              register={register("taxIdentificationNumber")}
            />

            <TextInput
              type="text"
              label="Business Licence Number"
              hasError={errors.licenceNumber?.type != undefined}
              error={errors.licenceNumber?.message}
              register={register("licenceNumber")}
            />

            {/* <TextInput
              type="date"
              label="Expire Date"
              hasError={errors.licenceExpireDate?.type !== undefined}
              error={errors.licenceExpireDate?.message}
              register={register("licenceExpireDate")}
              min={today}
            /> */}

            <TextInput
              type="date"
              label="Expire Date"
              hasError={errors.licenceExpireDate?.type !== undefined}
              error={errors.licenceExpireDate?.message}
              register={register("licenceExpireDate")}
              min={new Date().toISOString().split("T")[0]} // Set min attribute to today's date
            />


            <div>
              <label htmlFor="resellerType" className="block mb-2">
                Entity Type
              </label>
              <select
                className={`${errors.type ? "input-error" : "input-normal"}`}
                {...register("type", {
                  required: "Type is required",
                  onChange: (e) => {
                    setTypeSelect(e.target.value); // Correctly handles state update
                  },
                })}
              >
                <option value=""></option>
                {auth.user && auth.user.role.role.includes("FULL_ADMIN") && (
                  <>
                    <option value="COUNTRY">COUNTRY</option>
                    <option value="FACTORY">FACTORY</option>
                    <option value="SOFTWARE">SOFTWARE</option>
                  </>
                )}
                {auth.user && auth.user.role.role.includes("COUNTRY_ADMIN") && (
                  <option value="VENDOR">VENDOR</option>
                )}
                {auth.user && auth.user.role.role.includes("VENDOR_ADMIN") && (
                  <option value="RESELLER">RESELLER</option>
                )}
              </select>
            </div>

            {typeSelect === "COUNTRY" && (
              <>
                <TextInput
                  type="text"
                  label="Currency"
                  hasError={errors.currency?.type != undefined}
                  error={errors.currency?.message}
                  register={register("currency")}
                />
                <TextInput
                  type="text"
                  label="Country code"
                  hasError={errors.code?.type != undefined}
                  error={errors.code?.message}
                  register={register("code")}
                />
              </>
            )}
            {typeSelect === "RESELLER" && (
              <>
                <TextInput
                  type="text"
                  label="selling price percentage"
                  hasError={errors.sellingPricePercantage?.type != undefined}
                  error={errors.sellingPricePercantage?.message}
                  register={register("sellingPricePercantage")}
                />
                <TextInput
                  type="text"
                  label="payment percentage"
                  hasError={errors.paymentPercantage?.type != undefined}
                  error={errors.paymentPercantage?.message}
                  register={register("paymentPercantage")}
                />
              </>
            )}

            <div className="mb-6">
              <label className="block mb-2">TIN File (pdf)</label>
              <label
                htmlFor="tinFile"
                className="label block py-10 bg-slate-50 border border-dashed border-slate-200 rounded-md"
              >
                <div className="text-slate-500 text-xs text-center font-light">
                  <IconFileText
                    size={32}
                    strokeWidth={1.5}
                    className="mx-auto mb-4"
                  />
                  {tinFileName ? (
                    <div>{tinFileName}</div>
                  ) : (
                    <Fragment>
                      <p>Add your tin copy file here</p>
                      <p className="text-green-600 font-medium">
                        click to browse
                      </p>
                    </Fragment>
                  )}
                </div>
                <input
                  type="file"
                  id="tinFile"
                  accept="application/pdf"
                  className="hidden"
                  {...register("tinFile")}
                />
              </label>

              <p className="text-xs text-red-500 mt-1 mx-0.5">
                {errors.tinFile?.message?.toString()}
              </p>
            </div>

            <div className="mb-6">
              <label className="block mb-2">Licence File (pdf)</label>
              <label
                htmlFor="licenceFile"
                className="label block py-10 bg-slate-50 border border-dashed border-slate-200 rounded-md"
              >
                <div className="text-slate-500 text-xs text-center font-light">
                  <IconFileText
                    size={32}
                    strokeWidth={1.5}
                    className="mx-auto mb-4"
                  />
                  {licenceFileName ? (
                    <div>{licenceFileName}</div>
                  ) : (
                    <Fragment>
                      <p>Add your licence file here</p>
                      <p className="text-green-600 font-medium">
                        click to browse
                      </p>
                    </Fragment>
                  )}
                </div>
                <input
                  type="file"
                  id="licenceFile"
                  accept="application/pdf"
                  className="hidden"
                  {...register("licenceFile")}
                />
              </label>

              <p className="text-xs text-red-500 mt-1 mx-0.5">
                {errors.licenceFile?.message?.toString()}
              </p>
            </div>

            <div className="mb-6">
              <label className="block mb-2">Other Files (pdf)</label>
              <label
                htmlFor="otherFile"
                className="label block py-10 bg-slate-50 border border-dashed border-slate-200 rounded-md"
              >
                <div className="text-slate-500 text-xs text-center font-light">
                  <IconFileText
                    size={32}
                    strokeWidth={1.5}
                    className="mx-auto mb-4"
                  />
                  {otherFileName ? (
                    <div>{otherFileName}</div>
                  ) : (
                    <Fragment>
                      <p>Add other files here</p>
                      <p className="text-green-600 font-medium">
                        click to browse
                      </p>
                    </Fragment>
                  )}
                </div>
                <input
                  type="file"
                  id="otherFile"
                  accept="application/pdf"
                  className="hidden"
                  {...register("otherFile")}
                />
              </label>

              <p className="text-xs text-red-500 mt-1 mx-0.5">
                {errors.otherFile?.message?.toString()}
              </p>
            </div>
          </div>

          <Button
            type="submit"
            label="Save changes"
            theme="primary"
            size="md"
            loading={createMutation.isLoading || updateMutation.isLoading}
          />
        </form>
      </Modal>
    </div>
  );
}

function useVendorGroup(arg0: { page: number; search: string; filter: {} }) {
  throw new Error("Function not implemented.");
}
